import { ImageResponse } from "next/og";
import { profile, seo } from "@/data/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STACK = ["Next.js", "FastAPI", "PostgreSQL", "TypeScript", "Real-time"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px",
          background: "#FAF7F2",
          backgroundImage:
            "radial-gradient(50rem 36rem at 0% -10%, rgba(234,158,74,0.20), transparent 60%), radial-gradient(44rem 34rem at 110% 120%, rgba(226,106,78,0.16), transparent 60%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #F2854E, #DC4E2A)",
              color: "#FFF7F0",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            J
          </div>
          <div style={{ display: "flex", fontSize: "22px", color: "#69625A", letterSpacing: "0.04em", fontFamily: "sans-serif" }}>
            {`${profile.role} · ${profile.location}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", fontSize: "76px", fontWeight: 600, color: "#1F1B18", lineHeight: 1.05 }}>
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              color: "#4a443d",
              maxWidth: "960px",
              lineHeight: 1.35,
              fontFamily: "sans-serif",
            }}
          >
            {seo.ogSubtitle}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontFamily: "sans-serif" }}>
          {STACK.map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                fontSize: "20px",
                color: "#69625A",
                padding: "8px 18px",
                borderRadius: "999px",
                border: "1px solid #E9E2D8",
                background: "#FFFFFF",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
