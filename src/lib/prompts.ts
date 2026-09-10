export type ToolId = "email" | "notes" | "planner" | "research";

export type FieldDef = {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select" | "number";
  options?: string[];
  defaultValue?: string;
  rows?: number;
  required?: boolean;
};

export type ToolConfig = {
  id: ToolId;
  title: string;
  tagline: string;
  cta: string;
  fields: FieldDef[];
};

export const DISCLAIMER =
  "Mainstreet uses AI to generate drafts. It can be wrong or miss context. Always review before sending, scheduling, or publishing.";

export const TOOLS: Record<ToolId, ToolConfig> = {
  email: {
    id: "email",
    title: "Email Generator",
    tagline: "A ready-to-send draft in your chosen tone.",
    cta: "Generate email",
    fields: [
      {
        name: "purpose",
        label: "Purpose of the email",
        placeholder: "e.g. Let a supplier know our order will be a week late",
        type: "textarea",
        rows: 4,
        required: true,
      },
      { name: "recipient", label: "Recipient", placeholder: "e.g. Thandi at Riverside Supplies", type: "text" },
      {
        name: "tone",
        label: "Tone",
        placeholder: "",
        type: "select",
        options: ["Formal", "Friendly", "Persuasive", "Apologetic", "Brief"],
      },
      {
        name: "keyPoints",
        label: "Key points (optional)",
        placeholder: "One point per line",
        type: "textarea",
        rows: 4,
      },
    ],
  },
  notes: {
    id: "notes",
    title: "Meeting Notes Summarizer",
    tagline: "Turn raw notes into decisions and action items.",
    cta: "Summarize notes",
    fields: [
      {
        name: "notes",
        label: "Paste your meeting notes",
        placeholder: "Paste everything you jotted down — bullet points are fine.",
        type: "textarea",
        rows: 12,
        required: true,
      },
    ],
  },
  planner: {
    id: "planner",
    title: "Task Planner",
    tagline: "A prioritised, time-boxed schedule for your tasks.",
    cta: "Build schedule",
    fields: [
      {
        name: "tasks",
        label: "Your tasks (one per line)",
        placeholder: "Order stock\nCall the accountant\nUpdate the price list",
        type: "textarea",
        rows: 8,
        required: true,
      },
      { name: "range", label: "Plan for", placeholder: "", type: "select", options: ["Day", "Week"] },
      {
        name: "hours",
        label: "Working hours per day",
        placeholder: "6",
        type: "number",
        defaultValue: "6",
      },
    ],
  },
  research: {
    id: "research",
    title: "Research Assistant",
    tagline: "A practical briefing on any topic or pasted text.",
    cta: "Research this",
    fields: [
      {
        name: "topic",
        label: "Topic or pasted text",
        placeholder: "e.g. How should a small café handle card-machine fees?",
        type: "textarea",
        rows: 10,
        required: true,
      },
    ],
  },
};

const BASE =
  "You are Mainstreet, a friendly, practical AI workplace assistant for small business owners and small teams. Write in plain language. Never invent facts, names, dates or numbers the user did not give you.";

export function buildPrompt(tool: ToolId, data: Record<string, string>) {
  const f = (k: string, fallback = "not specified") => data[k]?.trim() || fallback;

  switch (tool) {
    case "email":
      return {
        system: `${BASE} Write a complete, ready-to-send email in the requested tone, with a Subject line first. Only use facts the user gives — never invent names, dates, or numbers. Use [brackets] for missing info.`,
        prompt: [
          `Purpose: ${f("purpose")}`,
          `Recipient: ${f("recipient")}`,
          `Tone: ${f("tone", "Friendly")}`,
          `Key points: ${f("keyPoints", "none provided")}`,
        ].join("\n"),
      };
    case "notes":
      return {
        system: `${BASE} Summarize these meeting notes into exactly 3 sections: SUMMARY (2-4 sentences), DECISIONS (bullets), ACTION ITEMS (bullets formatted as Task — Owner — Deadline). Never invent details not in the notes.`,
        prompt: `Meeting notes:\n\n${f("notes")}`,
      };
    case "planner":
      return {
        system: `${BASE} Prioritize these tasks by urgency and importance, then build a time-boxed schedule per day for the requested range. Never invent tasks. Flag anything that won't realistically fit.`,
        prompt: [
          `Plan range: ${f("range", "Day")}`,
          `Working hours per day: ${f("hours", "6")}`,
          `Tasks (one per line):`,
          f("tasks"),
        ].join("\n"),
      };
    case "research":
      return {
        system: `${BASE} Respond in 3 sections: SUMMARY (3-5 sentences), KEY INSIGHTS (bullets), RECOMMENDATIONS (practical bullets for a small business). Add a 'Note:' reminder to verify details if the topic is time-sensitive.`,
        prompt: `Topic or text:\n\n${f("topic")}`,
      };
  }
}

export const CHAT_SYSTEM_PROMPT = `You are Mainstreet, a friendly, practical workplace assistant for small business staff. Give concise plain-language answers. For legal/tax/medical questions, recommend confirming with a professional. Never invent facts, names, dates or numbers.`;
