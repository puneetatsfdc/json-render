export type NavItem = {
  title: string;
  href: string;
  external?: boolean;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const docsNavigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Migration Guide", href: "/docs/migration" },
      { title: "Changelog", href: "/docs/changelog" },
    ],
  },
  {
    title: "Core",
    items: [
      { title: "Specs", href: "/docs/specs" },
      { title: "Schemas", href: "/docs/schemas" },
      { title: "Catalog", href: "/docs/catalog" },
      { title: "Data Binding", href: "/docs/data-binding" },
      { title: "Visibility", href: "/docs/visibility" },
      { title: "Validation", href: "/docs/validation" },
    ],
  },
  {
    title: "Rendering",
    items: [
      { title: "Registry", href: "/docs/registry" },
      { title: "Streaming", href: "/docs/streaming" },
      { title: "Generation Modes", href: "/docs/generation-modes" },
    ],
  },
  {
    title: "Examples",
    items: [
      {
        title: "Chat",
        href: "https://github.com/vercel-labs/json-render/tree/main/examples/chat",
        external: true,
      },
      {
        title: "Dashboard",
        href: "https://github.com/vercel-labs/json-render/tree/main/examples/dashboard",
        external: true,
      },
      {
        title: "React Native",
        href: "https://github.com/vercel-labs/json-render/tree/main/examples/react-native",
        external: true,
      },
      {
        title: "Remotion",
        href: "https://github.com/vercel-labs/json-render/tree/main/examples/remotion",
        external: true,
      },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Custom Schema", href: "/docs/custom-schema" },
      { title: "Code Export", href: "/docs/code-export" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { title: "AI SDK", href: "/docs/ai-sdk" },
      { title: "A2UI", href: "/docs/a2ui" },
      { title: "Adaptive Cards", href: "/docs/adaptive-cards" },
      { title: "AG-UI", href: "/docs/ag-ui" },
      { title: "OpenAPI", href: "/docs/openapi" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "@json-render/core", href: "/docs/api/core" },
      { title: "@json-render/react", href: "/docs/api/react" },
      { title: "@json-render/react-native", href: "/docs/api/react-native" },
      { title: "@json-render/remotion", href: "/docs/api/remotion" },
      { title: "@json-render/codegen", href: "/docs/api/codegen" },
    ],
  },
];

// Flatten all pages for current page lookup (excludes external links)
export const allDocsPages = docsNavigation.flatMap((section) =>
  section.items.filter((item) => !item.external),
);
