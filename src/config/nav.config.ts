import type { ButtonVariant } from "../components/ui/button";

// Navigation config
export const documentationLinks = [
  { href: "/specification/", label: "Specification" },
  { href: "/guides/getting-started/", label: "Getting Started" },
  { href: "/guides/examples/", label: "Examples" },
  { href: "/libraries/", label: "Libraries" },
];

export const communityLinks = [
  { href: "https://github.com/ucan-wg", label: "GitHub" },
  { href: "/about/", label: "About" },
];

export const mainNavLinks = [
  { href: "/getting-started/", label: "Getting Started" },
  { href: "/libraries/", label: "Libraries" },
  { href: "/inspector/", label: "Inspector" },
  { href: "/about/", label: "About" },
];

export const actionLinks: {
  href: string;
  label: string;
  icon: string;
  variant: ButtonVariant;
}[] = [
  { href: "https://github.com/ucan-wg", label: "Star on GitHub", icon: "lucide:star", variant: "secondary" },
  { href: "/specification/", label: "Read Spec", icon: "lucide:book", variant: "default" },
];
