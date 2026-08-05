"use client";

import { Calendar } from "lucide-react";
import Script from "next/script";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

const CALENDLY_URL = "https://calendly.com/sehgaljai81/30min";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export function CalendlyBookButton() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  function openCalendly() {
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
  }

  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <Button type="button" variant="secondary" onClick={openCalendly}>
        <Calendar className="h-4 w-4" aria-hidden />
        Schedule time with me
      </Button>
    </>
  );
}
