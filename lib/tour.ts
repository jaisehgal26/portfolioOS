const TOUR_DONE_KEY = "jaios-tour-done";
const TOUR_BANNER_KEY = "jaios-tour-banner-dismissed";

export function isTourDone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(TOUR_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markTourDone() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOUR_DONE_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function isTourBannerDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(TOUR_BANNER_KEY) === "1";
  } catch {
    return true;
  }
}

export function dismissTourBanner() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOUR_BANNER_KEY, "1");
  } catch {
    /* private mode */
  }
}
