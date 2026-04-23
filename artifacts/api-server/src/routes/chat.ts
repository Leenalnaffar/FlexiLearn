import { Router, type IRouter } from "express";
import {
  SendChatMessageBody,
  SendChatMessageResponse,
  GetSessionMapBody,
  GetSessionMapResponse,
} from "@workspace/api-zod";
import { openai } from "../lib/openai";

const router: IRouter = Router();

const SYSTEM_FRAMEWORK = `You are part of FlexiLearn, a three-tier multi-agent learning system.

TIER 1 — ANALYZERS: Behind-the-scenes models that have already classified the learner's needs and chosen this specialist for you.
TIER 2 — MANAGER AGENT: Coordinates the lesson, monitors comprehension, and decides when to hand off. Your responses should feel coherent within a managed lesson plan.
TIER 3 — SPECIALIST AGENTS (you are one of these):
  - Visualizer: teaches through diagrams. Frequently emit a Mermaid diagram inside a \`\`\`mermaid code block to illustrate concepts.
  - Narrator: teaches through spoken-style prose, conversational, rhythmic, easy to listen to.
  - Scrivener: teaches through clear written passages, structured paragraphs, well-organized notes.
  - Protégé: YOU are the student. The user is the teacher. Ask them to explain a topic, ask clarifying questions, occasionally make plausible mistakes for them to correct (Feynman technique).

You always stay in character for your assigned specialist. Do not break the fourth wall about being an AI unless asked directly.

=== USER-FACING OUTPUT BOUNDARY (critical) ===
The student sees EVERY character you produce. There is no separate scratchpad.
Therefore your output must be ONLY the final, polished, in-character lesson content.

You MUST NOT include any of the following in your reply:
- Planning notes, outlines of what you are about to write, or "let me think" preambles.
- Phrases like: "Plan:", "Steps:", "Step 1 / Step 2 (as a plan)", "First, I will…", "Here is my approach…", "Let me…", "I will now…", "Outline:", "Draft:", "Thinking:", "Reasoning:", "Internal:", "As an AI…".
- Meta-commentary about which specialist you are, which mode you are in, or that you are about to produce a diagram (just produce it).
- Restating the user's question back to them before answering.
- A markdown outline followed by the same content again.
- Any duplication of content you are also rendering as a diagram or artifact.

Begin your reply directly with the lesson content. No preface. No closing meta-commentary.`;

function specialistFor(
  learningStyle: "visual" | "auditory" | "reading" | "kinesthetic",
): "visualizer" | "narrator" | "scrivener" | "protege" {
  switch (learningStyle) {
    case "visual":
      return "visualizer";
    case "auditory":
      return "narrator";
    case "reading":
      return "scrivener";
    case "kinesthetic":
      return "protege";
  }
}

function specialistInstructions(
  agent: "visualizer" | "narrator" | "scrivener" | "protege",
): string {
  switch (agent) {
    case "visualizer":
      return `You are the VISUALIZER specialist. Whenever a concept can be diagrammed (and most can), include a Mermaid diagram in a \`\`\`mermaid code block. Prefer flowcharts, sequence diagrams, or mindmaps. Keep prose around the diagram extremely brief — at most one short caption sentence before and one after. The diagram is the lesson; do NOT also describe the diagram in prose.`;
    case "narrator":
      return `You are the NARRATOR specialist. Speak in a warm, rhythmic, conversational style as though you were reading aloud. Use short sentences and natural cadence. No bullet lists or markdown — flowing prose only.`;
    case "scrivener":
      return `You are the SCRIVENER specialist. Produce well-structured written explanations: clear paragraphs, occasional headings, definitions called out clearly. Treat each response like a polished page of a textbook.`;
    case "protege":
      return `You are the PROTÉGÉ specialist. The USER is your teacher and you are their student. Ask them to teach you the topic. Ask thoughtful clarifying questions. Periodically restate what you have understood. Sometimes get something subtly wrong on purpose so the user must correct you (Feynman technique). Never lecture — your job is to elicit teaching from the user.`;
  }
}

function neuroAddon(neuro: "standard" | "adhd" | "autism" | "dyslexia"): string {
  switch (neuro) {
    case "standard":
      return "";
    case "adhd":
      return `\n\nADHD MODE: Keep responses tight and energetic. Open with the single most interesting fact. Use short bursts. Offer a quick "next step" prompt at the end so momentum is never lost.`;
    case "autism":
      return `\n\nSENSORY-SAFE MODE: Avoid metaphors, idioms, sarcasm, and ambiguous language. Be literal. Use predictable structure (Definition → Example → Summary). When introducing a new section, name it explicitly. Never use exclamation marks.`;
    case "dyslexia":
      return `\n\nDECODING MODE: Use short sentences and common words. Break long words by syllables when first introduced (e.g. "pho-to-syn-the-sis"). Avoid dense paragraphs.`;
  }
}

function extractMermaid(text: string): string | undefined {
  const m = text.match(/```mermaid\s*([\s\S]*?)```/);
  return m ? m[1].trim() : undefined;
}

/**
 * Strip "internal thinking" / planning patterns and any mermaid code block
 * from the user-facing reply. The diagram is rendered separately as an
 * artifact, so it must not also appear as raw code in the chat bubble.
 */
function sanitizeReply(raw: string, mermaidExtracted: boolean): string {
  let text = raw;

  // Remove the mermaid block(s) from the visible text — they are rendered separately.
  if (mermaidExtracted) {
    text = text.replace(/```mermaid\s*[\s\S]*?```/g, "").trim();
  }

  // Strip common "thinking" / planning preamble blocks.
  const metaPatterns: RegExp[] = [
    /^(?:\s*\**\s*)?(?:thinking|reasoning|internal|scratch ?pad|plan|planning|outline|draft|approach|steps?)\s*[:\-—]\s*[\s\S]*?(?:\n\s*\n|$)/i,
    /^(?:\s*[-*]\s*)?(?:let me (?:think|plan|outline|draft)|first[, ]+i(?:'?ll| will)|i(?:'?ll| will) (?:now |first |start by )?(?:plan|outline|think|draft|approach|consider))[^\n]*\n+/i,
    /^\s*here(?:'s| is) (?:my|the) (?:plan|approach|outline|thinking)[^\n]*\n+/i,
    /^\s*as an ai[^\n]*\n+/i,
  ];
  for (const re of metaPatterns) {
    text = text.replace(re, "");
  }

  // Strip a leading "Step N: …" planning ladder if it precedes real content.
  text = text.replace(/^(?:\s*step\s*\d+\s*[:\-].*\n){2,}\s*\n/i, "");

  // Collapse 3+ blank lines.
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return text;
}

router.post("/chat", async (req, res, next) => {
  try {
    const body = SendChatMessageBody.parse(req.body);
    const agent = specialistFor(body.learningStyle);

    const system =
      SYSTEM_FRAMEWORK +
      "\n\n" +
      specialistInstructions(agent) +
      neuroAddon(body.neuroProfile) +
      (body.topic ? `\n\nCURRENT TOPIC: ${body.topic}` : "");

    type Attachment = { name: string; mimeType: string; dataUrl: string };

    const buildUserContent = (
      text: string,
      attachments: Attachment[] | undefined,
    ) => {
      if (!attachments || attachments.length === 0) return text;
      const parts: Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      > = [];
      const textParts: string[] = [text];
      for (const a of attachments) {
        if (a.mimeType.startsWith("image/")) {
          parts.push({ type: "image_url", image_url: { url: a.dataUrl } });
        } else {
          // For non-image files, decode the base64 payload as text and inline it.
          try {
            const b64 = a.dataUrl.split(",")[1] ?? "";
            const decoded = Buffer.from(b64, "base64").toString("utf8");
            const truncated =
              decoded.length > 20000
                ? decoded.slice(0, 20000) + "\n...(truncated)"
                : decoded;
            textParts.push(
              `\n\n[Attached file: ${a.name} (${a.mimeType})]\n${truncated}`,
            );
          } catch {
            textParts.push(`\n\n[Attached file: ${a.name} (${a.mimeType}) — could not be read as text]`);
          }
        }
      }
      parts.unshift({ type: "text", text: textParts.join("") });
      return parts;
    };

    const historyMessages = body.history.map((m) => ({
      role: m.role as "user" | "assistant",
      content:
        m.role === "user"
          ? buildUserContent(m.content, m.attachments as Attachment[] | undefined)
          : m.content,
    })) as Array<{
      role: "user" | "assistant";
      content: string | Array<{ type: string; [k: string]: unknown }>;
    }>;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: [
        { role: "system", content: system },
        ...historyMessages,
        {
          role: "user",
          content: buildUserContent(
            body.message,
            body.attachments as Attachment[] | undefined,
          ),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    });

    const rawReply = completion.choices[0]?.message?.content?.trim() ?? "";
    const mermaid = agent === "visualizer" ? extractMermaid(rawReply) : undefined;
    const reply = sanitizeReply(rawReply, Boolean(mermaid));
    const rewardPoints = body.neuroProfile === "adhd" ? 10 : undefined;

    const data = SendChatMessageResponse.parse({
      reply,
      agent,
      ...(mermaid ? { mermaid } : {}),
      ...(rewardPoints !== undefined ? { rewardPoints } : {}),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/session-map", async (req, res, next) => {
  try {
    const body = GetSessionMapBody.parse(req.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 2048,
      messages: [
        {
          role: "system",
          content: `You produce structured lesson outlines for the FlexiLearn Sensory-Safe mode. Return ONLY valid JSON of shape: { "topic": string, "steps": [{ "title": string, "description": string, "durationMinutes": integer }] }. Produce 4-6 steps. Be literal, predictable, no metaphors. Each step description should be one short factual sentence.`,
        },
        {
          role: "user",
          content: `Topic: ${body.topic}\nLearning style: ${body.learningStyle}\nNeuro profile: ${body.neuroProfile}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    const data = GetSessionMapResponse.parse({
      topic: parsed.topic ?? body.topic,
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
