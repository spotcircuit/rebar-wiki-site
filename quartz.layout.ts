import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      Rebar: "https://github.com/spotcircuit/rebar",
      "getrebar.dev": "https://getrebar.dev",
      Quartz: "https://github.com/jackyzha0/quartz",
    },
  }),
}

// Explorer folder order — most-used first, framework mechanics first, reference last.
// Rendered in the left-side navigation. Root-level files (index, getting-started,
// README) stay pinned at top automatically.
const FOLDER_ORDER: Record<string, number> = {
  "how-it-works": 1,   // framework mechanics — the first thing a new reader needs
  "diagrams":     2,   // visuals that frame the rest
  "patterns":     3,   // reusable engineering patterns
  "decisions":    4,   // architectural decisions with rationale
  "platform":     5,   // platform-level knowledge (API behavior, gotchas)
  "tools":        6,   // per-tool guides
  "people":       7,   // team + ownership
  "examples":     8,   // worked examples (if present)
  "clients":      9,   // client case studies (if present)
}

const folderOrderFn = (a: any, b: any) => {
  // Keep Quartz's default file-over-folder behavior within each folder;
  // only reorder the top-level folder entries by FOLDER_ORDER.
  if (a.file && !b.file) return -1
  if (!a.file && b.file) return 1
  if (!a.file && !b.file) {
    const ao = FOLDER_ORDER[a.displayName?.toLowerCase?.() ?? ""] ?? 99
    const bo = FOLDER_ORDER[b.displayName?.toLowerCase?.() ?? ""] ?? 99
    if (ao !== bo) return ao - bo
  }
  return (a.displayName ?? "").localeCompare(b.displayName ?? "")
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({ sortFn: folderOrderFn, folderClickBehavior: "collapse", folderDefaultState: "open" }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({ sortFn: folderOrderFn, folderClickBehavior: "collapse", folderDefaultState: "open" }),
  ],
  right: [],
}
