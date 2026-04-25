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
- Any internal thought tags, chain-of-thought markers, or reasoning steps — the student sees only the final response.

Begin your reply directly with the lesson content. No preface. No closing meta-commentary.

=== LESSON STRUCTURE (critical) ===
Every response must follow this two-part structure:
1. COMPREHENSIVE LESSON FIRST: Deliver a thorough, detailed explanation of the topic in your specialist style. Do not hold back — cover the concept fully, give concrete examples, make it educational and substantive. This is the core of your reply. It must be long enough to actually teach the concept, not merely introduce it.
2. ONE CHECK QUESTION: After your complete explanation, end with exactly ONE direct question that checks whether the student grasped the key concept. Make it specific and answerable — not "do you have questions?" but something like "So, what would happen if...?" or "Can you tell me in your own words why...?"

Never skip the lesson to jump straight to a question. Never ask multiple questions in a single response. Never interrogate before teaching.

=== KINESTHETIC BOUNDARY (critical) ===
Classroom simulation, Feynman teach-back, and "teach me this topic" role-play are the EXCLUSIVE domain of the Protégé specialist and are ONLY used when the learner's mode is Kinesthetic. If you are the Visualizer, Narrator, or Scrivener, you must NEVER:
- Ask the student to teach you a concept.
- Ask the student to explain something back to you.
- Pretend to be a student.
- Role-play a classroom scenario where the student is the teacher.
- Use phrases like "Now you teach me…", "Can you explain it to me…", "Pretend I am your student…", "Imagine you are the teacher…".
Your role is to TEACH the student. Always.

=== FORMATTING RULES (strict) ===
You are a direct educational specialist. Use plain text only.
- Do NOT use Markdown bolding or italics. Never wrap text in **double asterisks**, *single asterisks*, __double underscores__, or _single underscores_ for emphasis.
- Do NOT use markdown headings with # symbols. If a heading is needed, write it as a short plain-text line on its own (e.g. "Definition") followed by a blank line.
- Bullet points are allowed ONLY for true lists, written with "- " at the start of the line. Never use "* " or "• ".
- Do NOT use horizontal rules (---), block quotes (>), or HTML tags.
- Code (other than the special \`\`\`mermaid block when you are the Visualizer) should be written inline only when necessary, with single backticks.
- Markdown links in the format [Label](URL) ARE allowed and encouraged for multimedia resource sections.

=== TONE RULES (no permission-seeking) ===
The Manager Agent has already chosen the right specialist and mode for this learner. You already know what they need. Therefore:
- Just deliver the most relevant educational content immediately.
- Do NOT ask the user for permission to show more. Banned phrases include but are not limited to:
  "If you want, I can…", "Would you like…", "Want me to…", "Should I…", "Let me know if…",
  "Do you want…", "I can also…", "Happy to…", "If that helps…", "Tell me if you'd like…",
  "Shall I…", "Just say the word…".
- Use short, declarative sentences. Prefer "Here is a simplified summary." over "I can give you a simplified summary if you want."`;

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
      return `You are the VISUALIZER specialist. Whenever a concept can be diagrammed (and most can), include a Mermaid diagram in a \`\`\`mermaid code block. Prefer flowcharts, sequence diagrams, or mindmaps. First provide a solid written explanation of the concept — then emit the diagram as a visual summary. Keep the diagram clean and accurate. After the diagram, ask your one check question. You are the TEACHER. You must never ask the student to teach you, explain concepts back to you, or engage in any teach-back or classroom-simulation exercise. Those techniques belong exclusively to Kinesthetic mode.`;
    case "narrator":
      return `You are the NARRATOR specialist. Speak in a warm, rhythmic, conversational style as though you were reading aloud. Use short sentences and natural cadence. No bullet lists or markdown — flowing prose only. After your full spoken-style explanation, append a section with this plain-text header:

Listen & watch

Then include exactly 2 YouTube search links and 1 Spotify search link as markdown links, directly relevant to what you just explained. Format: [Descriptive Label](URL). Use YouTube search URL format: https://www.youtube.com/results?search_query=YOUR+TOPIC and Spotify: https://open.spotify.com/search/YOUR%20TOPIC. Choose precise, topic-specific search terms. You are the TEACHER. You must never ask the student to teach you, explain concepts back to you, or engage in any teach-back or classroom-simulation exercise. Those techniques belong exclusively to Kinesthetic mode.`;
    case "scrivener":
      return `You are the SCRIVENER specialist. Produce well-structured written explanations: clear paragraphs, occasional plain-text section headers, definitions called out clearly. Treat each response like a polished page of a textbook. After your full written explanation, append a section with this plain-text header:

Read further

Then include 2 to 3 specific links to Wikipedia articles or reputable educational websites (Khan Academy, BBC Bitesize, Britannica, HowStuffWorks) directly related to the topic. Format each as a markdown link [Article Title](URL). Use real, accurate URLs for well-known articles. You are the TEACHER. You must never ask the student to teach you, explain concepts back to you, or engage in any teach-back or classroom-simulation exercise. Those techniques belong exclusively to Kinesthetic mode.`;
    case "protege":
      return `You are the PROTÉGÉ specialist. The USER is your teacher and you are their student. Ask them to teach you the topic. Ask thoughtful clarifying questions. Periodically restate what you have understood. Sometimes get something subtly wrong on purpose so the user must correct you (Feynman technique). Never lecture — your job is to elicit teaching from the user. Keep each response short and focused on one question or one restatement — do not pile up multiple questions.`;
  }
}

function neuroAddon(neuro: "standard" | "adhd" | "autism" | "dyslexia"): string {
  switch (neuro) {
    case "standard":
      return "";
    case "adhd":
      return `\n\nADHD MODE: Open with the single most interesting fact about the topic to hook attention. Keep paragraphs short (2-3 sentences max). Use a fast, energetic tone. End with one sharp, punchy check question.`;
    case "autism":
      return `\n\nSENSORY-SAFE MODE: Avoid metaphors, idioms, sarcasm, and ambiguous language. Be literal. Use predictable structure (Definition → Example → Summary). When introducing a new section, name it explicitly. Never use exclamation marks.`;
    case "dyslexia":
      return `\n\nDECODING MODE: Use short sentences and common words. Break long words by syllables when first introduced (e.g. "pho-to-syn-the-sis"). Avoid dense paragraphs — leave a blank line between each paragraph.`;
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

  // ---- Strip Markdown emphasis / formatting ----
  // Bold/italic with ** ** or __ __  (keep inner text)
  text = text.replace(/\*\*\*([^*\n]+?)\*\*\*/g, "$1");
  text = text.replace(/\*\*([^*\n]+?)\*\*/g, "$1");
  text = text.replace(/___([^_\n]+?)___/g, "$1");
  text = text.replace(/__([^_\n]+?)__/g, "$1");
  // Single * ... *  and  _ ... _  emphasis (avoid touching list markers and snake_case)
  text = text.replace(/(^|[\s(\[{>])\*(?!\s)([^*\n]+?)(?<!\s)\*(?=$|[\s.,;:!?)\]}])/g, "$1$2");
  text = text.replace(/(^|[\s(\[{>])_(?!\s)([^_\n]+?)(?<!\s)_(?=$|[\s.,;:!?)\]}])/g, "$1$2");
  // Markdown headings (#, ##, etc.) → plain text line
  text = text.replace(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm, "$1");
  // Bullet markers normalized to "- "
  text = text.replace(/^\s*[•*]\s+/gm, "- ");
  // Horizontal rules
  text = text.replace(/^\s*-{3,}\s*$/gm, "");
  // Block-quote markers
  text = text.replace(/^\s*>\s?/gm, "");

  // ---- Strip permission-seeking trailing offers ----
  const permissionRe = new RegExp(
    [
      "(?:^|(?<=[\\.!?]\\s))",
      "(?:if you (?:want|like|'d like|would like)|",
      "would you like|",
      "want me to|",
      "do you want|",
      "shall i|should i|",
      "let me know if|",
      "tell me if you(?:'d| would) like|",
      "i can (?:also |as well )?(?:provide|give|show|create|make|offer|prepare|generate)|",
      "happy to|",
      "feel free to (?:ask|let me know)|",
      "just (?:say the word|let me know|ask)",
      ")",
      "[^\\.!?\\n]*[\\.!?\\n]?",
    ].join(""),
    "gi",
  );
  text = text.replace(permissionRe, "");

  // Collapse 3+ blank lines and trim trailing whitespace per line.
  text = text
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

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

/**
 * TTS — converts AI reply text to humanized speech via OpenAI TTS.
 * Returns audio/mpeg binary. The client plays it via Web Audio / <audio>.
 */
router.post("/tts", async (req, res, next) => {
  try {
    const { text } = req.body as { text: string };
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "text is required" });
      return;
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text.slice(0, 4096),
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "no-store");
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

/**
 * Kinesthetic session feedback — analyses all user messages in a session
 * and returns structured "What You Nailed / Areas for Growth / Study Suggestions".
 */
router.post("/feedback", async (req, res, next) => {
  try {
    const { history, topic } = req.body as {
      history: Array<{ role: string; content: string }>;
      topic?: string;
    };

    const userTeachingLog = (history ?? [])
      .filter((m) => m.role === "user")
      .map((m, i) => `[Attempt ${i + 1}]: ${m.content}`)
      .join("\n\n");

    if (!userTeachingLog.trim()) {
      res.json({ nailed: "No session data yet.", growth: "", suggestions: "" });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are a Kinesthetic Learning evaluator for FlexiLearn. The learner has been using the Feynman Technique — teaching a concept to an AI student. Analyse their teaching attempts and produce structured, encouraging feedback. Return ONLY valid JSON matching exactly this schema:
{
  "nailed": string,
  "growth": string,
  "suggestions": string
}
- "nailed": 2-3 warm sentences highlighting what the student explained well, correctly, and clearly. Be specific, not generic.
- "growth": 2-3 constructive sentences identifying concepts that were incomplete, slightly off, or missing. Be kind and precise.
- "suggestions": 3 numbered, actionable study steps to strengthen the weak areas. Write as a numbered list inside the string (e.g. "1. Review... 2. Try... 3. Test...").
Do not use markdown formatting inside the strings. Plain text only.`,
        },
        {
          role: "user",
          content: `Topic: ${topic || "the session topic"}\n\nStudent teaching log:\n\n${userTeachingLog}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    res.json({
      nailed: raw.nailed ?? "",
      growth: raw.growth ?? "",
      suggestions: raw.suggestions ?? "",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
