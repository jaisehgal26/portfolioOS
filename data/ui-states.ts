export type StateKind =
  | "empty"
  | "loading"
  | "streaming"
  | "success"
  | "error"
  | "retry"
  | "offline"
  | "permission"
  | "validation"
  | "notification"
  | "payment"
  | "payment-failed"
  | "typing"
  | "reconnecting"
  | "table-empty"
  | "dashboard-alert"
  | "disabled"
  | "optimistic";

export interface UIStateItem {
  kind: StateKind;
  label: string;
  caption: string;
  /** Where I've applied this thinking in real work. */
  usedIn: string;
}

/**
 * The states most frontend devs never show. Each renders as a tiny, real
 * component in the UI Gallery — that's the point of the section.
 */
export const uiStates: UIStateItem[] = [
  { kind: "empty", label: "Empty", caption: "Guide the first action.", usedIn: "Dashboards & lists before data exists." },
  { kind: "loading", label: "Loading", caption: "Skeletons over spinners.", usedIn: "Every async surface — tables, charts, feeds." },
  { kind: "streaming", label: "Streaming", caption: "Show progress as it arrives.", usedIn: "AI chat token streaming." },
  { kind: "success", label: "Success", caption: "Confirm with confidence.", usedIn: "Payment & form confirmations." },
  { kind: "error", label: "Error", caption: "Explain, don't dead-end.", usedIn: "Failed fetches across products." },
  { kind: "retry", label: "Retry", caption: "Always offer a way forward.", usedIn: "Flaky network requests." },
  { kind: "offline", label: "Offline", caption: "Stay usable without a network.", usedIn: "Real-time chat & PWAs." },
  { kind: "permission", label: "Permission denied", caption: "Be clear about access.", usedIn: "RBAC-gated healthcare & admin views." },
  { kind: "validation", label: "Validation", caption: "Help before failing.", usedIn: "Complex PAC & payment forms." },
  { kind: "notification", label: "Notification", caption: "Surface change calmly.", usedIn: "Live in-app alerts." },
  { kind: "payment", label: "Payment pending", caption: "Build trust while waiting.", usedIn: "Real-time payment tracking." },
  { kind: "payment-failed", label: "Payment failed", caption: "Fail softly, recover fast.", usedIn: "Declined transactions with recovery." },
  { kind: "typing", label: "Chat typing", caption: "Signal presence and life.", usedIn: "WebSocket chat presence." },
  { kind: "reconnecting", label: "Reconnecting", caption: "Recover transparently.", usedIn: "Dropped-socket recovery." },
  { kind: "table-empty", label: "Table empty", caption: "Turn nothing into next steps.", usedIn: "Filtered inventory tables." },
  { kind: "dashboard-alert", label: "Dashboard alert", caption: "Make critical impossible to miss.", usedIn: "ICU vitals threshold alerts." },
  { kind: "disabled", label: "Disabled", caption: "Show why an action waits.", usedIn: "Gated actions & unmet prerequisites." },
  { kind: "optimistic", label: "Optimistic update", caption: "Respond instantly, reconcile later.", usedIn: "Instant chat sends & reactions." },
];
