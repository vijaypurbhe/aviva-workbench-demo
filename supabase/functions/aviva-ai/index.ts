// Aviva AI gateway — streams AI responses for the workbench demo.
// Actions: score | nba | quote_assist | summarize_call | draft_sms
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Lead = {
  name: string;
  product: string;
  province: string;
  source: string;
  email: string;
  phone: string;
  policyId: string;
  caslVerified: boolean;
  quote: Record<string, string>;
  history?: { title: string; sub: string; when: string }[];
};

function buildPrompt(action: string, lead: Lead, extra: any): { system: string; user: string } {
  const leadCtx = `Lead: ${lead.name} (${lead.product}, ${lead.province}). Source: ${lead.source}. CASL: ${lead.caslVerified ? "verified" : "pending"}. Policy: ${lead.policyId}. Quote: ${JSON.stringify(lead.quote)}. Recent history: ${(lead.history ?? []).slice(0, 4).map(h => `${h.when} — ${h.title}`).join("; ") || "n/a"}.`;
  const lang = lead.province === "QC" ? "Bilingual EN + FR" : "English";

  switch (action) {
    case "score":
      return {
        system: `You are Einstein Lead Scoring for Aviva Canada. Output STRICT JSON only matching: {"score": number 0-100, "tier": "HOT"|"WARM"|"COLD", "reasons": [string, string, string]}. No prose, no markdown.`,
        user: `${leadCtx}\nReturn the JSON now.`,
      };
    case "nba":
      return {
        system: `You are Einstein Next Best Action for Aviva Canada insurance agents. Output STRICT JSON only: {"recommendations":[{"label": "TOP RECOMMENDATION"|"UPSELL OPPORTUNITY"|"RETENTION RISK", "title": string (max 80 chars), "body": string (1-2 sentences, concrete), "cta": "Call Now"|"Send SMS"|"Offer Bundle"|"Schedule CB", "confidence": number 0-100, "tone": "primary"|"warn"}]}. Return 2 recommendations. No markdown.`,
        user: `${leadCtx}\nReturn the JSON now.`,
      };
    case "quote_assist":
      return {
        system: `You are Quote Assist Agent for Aviva Canada underwriters. Suggest 3 concrete adjustments to maximize bind probability while staying within UW guidelines. Output STRICT JSON: {"suggestions":[{"lever": string, "change": string, "impact": string, "delta": string}]}. Examples of lever: "Deductible","Bundle","Discount","Coverage". No markdown.`,
        user: `${leadCtx}\nReturn the JSON now.`,
      };
    case "summarize_call": {
      const { duration, outcome, notes } = extra ?? {};
      return {
        system: `You are a bilingual GenAI assistant summarizing an Aviva Canada agent call. Output ${lang} summary. Format as markdown with sections: **Summary** (2 sentences), **Next Steps** (bullets), **Compliance Flags** (bullets or "None"). For QC leads, add **Résumé (FR)** section translating Summary.`,
        user: `${leadCtx}\nCall outcome: ${outcome}. Duration: ${duration}s. Agent notes: ${notes ?? "none"}.\nWrite the wrap-up summary now.`,
      };
    }
    case "draft_sms": {
      const { template } = extra ?? {};
      return {
        system: `You draft compliant SMS for Aviva Canada. CASL rules: must include sender name (Aviva), reference to existing relationship, and STOP opt-out. Max 320 chars (2 segments). ${lead.province === "QC" ? "Write the message in French (Québec) since the lead is in QC." : "Write in English."}. Output ONLY the message body, no quotes, no preamble.`,
        user: `${leadCtx}\nPurpose: ${template ?? "follow-up"}. First name: ${lead.name.split(" ")[0]}. Draft the SMS now.`,
      };
    }
    default:
      return { system: "You are a helpful assistant.", user: leadCtx };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, lead, extra, stream = true } = await req.json();
    if (!action || !lead) {
      return new Response(JSON.stringify({ error: "action and lead are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { system, user } = buildPrompt(action, lead, extra);
    const wantsJson = ["score", "nba", "quote_assist"].includes(action);

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      stream,
    };
    if (wantsJson && !stream) body.response_format = { type: "json_object" };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }
    const json = await response.json();
    return new Response(JSON.stringify(json), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("aviva-ai error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
