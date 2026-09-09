export type ToolId = "email" | "notes" | "planner" | "research";

export type FieldDef = {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
};

export type ToolConfig = {
  id: ToolId;
  title: string;
  tagline: string;
  cta: string;
  fields: FieldDef[];
};

export const TOOLS: Record<ToolId, ToolConfig> = {
  email: {
    id: "email",
    title: "Smart Email Generator",
    tagline: "Draft clear, professional emails in seconds.",
    cta: "Generate email",
    fields: [
      { name: "recipient", label: "Recipient", placeholder: "e.g. Head of Operations", type: "text" },
      { name: "purpose", label: "What is the email about?", placeholder: "e.g. Request a deadline extension for the Q3 report", type: "textarea", required: true },
      { name: "tone", label: "Tone", placeholder: "", type: "select", options: ["Professional", "Friendly", "Direct", "Apologetic", "Persuasive"] },
      { name: "length", label: "Length", placeholder: "", type: "select", options: ["Short", "Medium", "Detailed"] },
    ],
  },
  notes: {
    id: "notes",
    title: "Meeting Notes Summarizer",
    tagline: "Turn messy notes or transcripts into decisions and action items.",
    cta: "Summarize notes",
    fields: [
      { name: "notes", label: "Meeting notes or transcript", placeholder: "Paste your raw notes here…", type: "textarea", required: true },
      { name: "audience", label: "Summary for", placeholder: "", type: "select", options: ["Whole team", "Leadership", "Client", "Personal follow-up"] },
    ],
  },
  planner: {
    id: "planner",
    title: "AI Task Planner",
    tagline: "Break a goal into a prioritised, time-boxed plan.",
    cta: "Build plan",
    fields: [
      { name: "goal", label: "Goal or project", placeholder: "e.g. Launch the new onboarding flow", type: "textarea", required: true },
      { name: "deadline", label: "Timeframe", placeholder: "e.g. 2 weeks", type: "text" },
      { name: "capacity", label: "Time available", placeholder: "", type: "select", options: ["A few hours a week", "Half my week", "Full-time focus"] },
    ],
  },
  research: {
    id: "research",
    title: "AI Research Assistant",
    tagline: "Get a structured briefing on any work topic.",
    cta: "Research topic",
    fields: [
      { name: "topic", label: "Topic or question", placeholder: "e.g. Best practices for hybrid team performance reviews", type: "textarea", required: true },
      { name: "depth", label: "Depth", placeholder: "", type: "select", options: ["Quick overview", "Balanced briefing", "Deep dive"] },
      { name: "format", label: "Output format", placeholder: "", type: "select", options: ["Briefing note", "Bullet summary", "Pros and cons", "FAQ"] },
    ],
  },
};

const SYSTEM_BASE =
  "You are an AI workplace productivity assistant for busy professionals. Write in clear, plain business English. Use markdown headings, bullets and bold sparingly for scannability. Never invent facts, names, numbers or citations; if something is unknown, say so and mark it as [confirm].";

export function buildPrompt(tool: ToolId, data: Record<string, string>) {
  const f = (k: string, fallback = "not specified") => data[k]?.trim() || fallback;

  switch (tool) {
    case "email":
      return {
        system: `${SYSTEM_BASE} You draft workplace emails. Always output a subject line, then the body, then a sign-off placeholder.`,
        prompt: [
          `Draft an email.`,
          `Recipient: ${f("recipient")}`,
          `Tone: ${f("tone", "Professional")}`,
          `Length: ${f("length", "Medium")}`,
          `Purpose and key points: ${f("purpose")}`,
          `Leave placeholders in square brackets for any detail I have not given you.`,
        ].join("\n"),
      };
    case "notes":
      return {
        system: `${SYSTEM_BASE} You summarize meetings. Use these sections: Summary, Key decisions, Action items (owner - task - due date), Open questions, Risks. Only use information present in the notes.`,
        prompt: [
          `Summarize these meeting notes for: ${f("audience", "Whole team")}`,
          ``,
          f("notes"),
        ].join("\n"),
      };
    case "planner":
      return {
        system: `${SYSTEM_BASE} You are a planning coach. Output: Objective, Milestones, Prioritised task list (with effort estimate and priority P1-P3), Suggested schedule, Watch-outs.`,
        prompt: [
          `Goal: ${f("goal")}`,
          `Timeframe: ${f("deadline", "flexible")}`,
          `Time available: ${f("capacity", "a few hours a week")}`,
        ].join("\n"),
      };
    case "research":
      return {
        system: `${SYSTEM_BASE} You produce research briefings from general knowledge only. You cannot browse the web, so never fabricate sources, statistics or quotes. End with a short "Verify before using" list.`,
        prompt: [
          `Topic: ${f("topic")}`,
          `Depth: ${f("depth", "Balanced briefing")}`,
          `Format: ${f("format", "Briefing note")}`,
        ].join("\n"),
      };
  }
}

export const CHAT_SYSTEM_PROMPT = `${SYSTEM_BASE} You are the assistant behind an AI Workplace Productivity Assistant app. Help with emails, meetings, planning, prioritisation and workplace research. Ask a brief clarifying question when the request is ambiguous. Keep answers concise unless depth is requested.`;
