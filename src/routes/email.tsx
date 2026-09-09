import { createFileRoute } from "@tanstack/react-router";

import { ToolWorkspace } from "@/components/ToolWorkspace";
import { TOOLS } from "@/lib/prompts";

const TITLE = "Smart Email Generator | Workplace AI";
const DESC =
  "Generate professional workplace emails with the right tone and length, then edit the draft before sending.";

export const Route = createFileRoute("/email")({
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
  component: () => <ToolWorkspace config={TOOLS.email} />,
});
