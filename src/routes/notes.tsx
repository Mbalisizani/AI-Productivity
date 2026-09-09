import { createFileRoute } from "@tanstack/react-router";

import { ToolWorkspace } from "@/components/ToolWorkspace";
import { TOOLS } from "@/lib/prompts";

const TITLE = "Meeting Notes Summarizer | Workplace AI";
const DESC =
  "Turn raw meeting notes or transcripts into decisions, action items and open questions in seconds.";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ToolWorkspace config={TOOLS.notes} />,
});
