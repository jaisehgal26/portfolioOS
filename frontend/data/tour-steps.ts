import type { AppId } from "./apps";

export type TourAction =
  | { type: "open-finder"; section: string }
  | { type: "open-app"; appId: AppId }
  | { type: "none" };

export interface TourStep {
  id: string;
  title: string;
  body: string;
  /** `data-tour` attribute value on a DOM element to spotlight. */
  target?: string;
  placement: "center" | "top" | "bottom" | "left" | "right";
  action?: TourAction;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to JaiOS",
    body: "This is my portfolio packaged as an operating system — explore use cases, projects, résumé, and contact like you would on a real desktop.",
    placement: "center",
    action: { type: "none" },
  },
  {
    id: "dock-finder",
    title: "Start in Finder",
    body: "Finder is your hub — about, use cases, experience, skills, résumé, and contact all live here.",
    target: "dock-finder",
    placement: "top",
    action: { type: "none" },
  },
  {
    id: "spotlight",
    title: "Jump anywhere",
    body: "Press ⌘K or Ctrl+K to open Spotlight — search apps, sections, and shortcuts instantly.",
    target: "spotlight",
    placement: "bottom",
    action: { type: "none" },
  },
  {
    id: "finder-work",
    title: "Use cases",
    body: "The Use cases section covers full-stack problems — payments, real-time, RBAC, AI surfaces, and what shipped.",
    target: "finder-work",
    placement: "right",
    action: { type: "open-finder", section: "work" },
  },
  {
    id: "case-studies",
    title: "Deep dives",
    body: "Case Studies opens full write-ups — AI streaming UI, payments, healthcare, and more. Recruiters: start here.",
    target: "case-studies",
    placement: "top",
    action: { type: "open-app", appId: "case-studies" },
  },
  {
    id: "finder-contact",
    title: "Get in touch",
    body: "Résumé PDF and contact details are in Finder → Contact. One click to email or download.",
    target: "finder-contact",
    placement: "right",
    action: { type: "open-finder", section: "contact" },
  },
  {
    id: "secret-hint",
    title: "Easter egg",
    body: "Curious types: there's a nearly invisible sparkle in the bottom-left corner. Decode the signal if you dare.",
    target: "secret-sparkle",
    placement: "top",
    action: { type: "none" },
  },
  {
    id: "done",
    title: "Want to hire me?",
    body: "Thanks for touring JaiOS. Reach out anytime — I'd love to hear about your team and what you're building.",
    placement: "center",
    action: { type: "none" },
  },
];
