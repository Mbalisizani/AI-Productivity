import { createFileRoute } from "@tanstack/react-router";

import { ToolWorkspace } from "@/components/ToolWorkspace";
import { TOOLS } from "@/lib/prompts";

const TITLE = "AI Task Planner | Workplace AI";
const DESC =
  "Break any work goal into prioritised milestones, task estimates and a realistic schedule.";

export const Route = createFileRoute("/planner")({
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
  component: () => <ToolWorkspace config={TOOLS.planner} />,
});
