import { useCallback, useRef, useState } from "react";
import type { Lead } from "@/data/mock";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aviva-ai`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export type AiAction = "score" | "nba" | "quote_assist" | "summarize_call" | "draft_sms";

type StreamOpts = {
  action: AiAction;
  lead: Lead;
  extra?: Record<string, unknown>;
  onDelta?: (chunk: string, full: string) => void;
  onDone?: (full: string) => void;
  onError?: (err: Error) => void;
};

export function useAviAi() {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, []);

  const stream = useCallback(async (opts: StreamOpts) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setText("");
    setError(null);
    setStreaming(true);
    let acc = "";
    try {
      const resp = await fetch(FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ANON}`,
          apikey: ANON,
        },
        body: JSON.stringify({
          action: opts.action,
          lead: opts.lead,
          extra: opts.extra ?? null,
          stream: true,
        }),
        signal: ctrl.signal,
      });
      if (!resp.ok || !resp.body) {
        if (resp.status === 429) throw new Error("AI is busy — try again in a moment.");
        if (resp.status === 402) throw new Error("AI credits exhausted.");
        throw new Error(`AI request failed (${resp.status})`);
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") { done = true; break; }
          try {
            const j = JSON.parse(payload);
            const c = j.choices?.[0]?.delta?.content;
            if (c) {
              acc += c;
              setText(acc);
              opts.onDelta?.(c, acc);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
      opts.onDone?.(acc);
      return acc;
    } catch (e) {
      if ((e as any)?.name === "AbortError") return acc;
      const err = e instanceof Error ? e : new Error("AI error");
      setError(err.message);
      opts.onError?.(err);
      return acc;
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, []);

  return { text, streaming, error, stream, stop, setText };
}

/** Best-effort JSON extractor — finds first {...} block in streamed text. */
export function tryParseJson<T = any>(s: string): T | null {
  if (!s) return null;
  const start = s.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) return null;
  try { return JSON.parse(s.slice(start, end + 1)); } catch { return null; }
}
