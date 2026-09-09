import { createFileRoute } from "@tanstack/react-router";

import { ToolWorkspace } from "@/components/ToolWorkspace";
import { TOOLS } from "@/lib/prompts";

const TITLE = "AI Research Assistant | Workplace AI";
const DESC =
  "Get a structured briefing on any workplace topic, with clear flags for anything you should verify.";

export const Route = createFileRoute("/research")({
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
  component: () => <ToolWorkspace config={TOOLS.research} />,
});
