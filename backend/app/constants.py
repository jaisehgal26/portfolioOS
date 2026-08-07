CASE_STUDY_IDS: frozenset[str] = frozenset(
    {
        "agentic-streaming",
        "payment-settlement",
        "rbac-permissions",
        "live-messaging",
        "clinical-live-ops",
        "admin-bulk-ops",
        "job-portal-funnels",
        "ai-in-product",
    }
)

PORTFOLIO_IDS: frozenset[str] = frozenset(
    {
        "quickpad",
        "formforge",
        "old-portfolio",
    }
)

NOTE_IDS: frozenset[str] = frozenset(
    {
        "problem-first",
        "agent-based-dev",
        "mcp-dev-loop",
        "agentic-ui-trust",
        "postgres-truth",
        "public-endpoints",
        "realtime-edges",
        "ui-honest-states",
        "split-monorepo",
        "analytics-as-feedback",
        "auth-friction",
        "velocity-with-boring",
    }
)

KNOWLEDGE_IDS: frozenset[str] = frozenset(
    {
        "css-custom-properties",
        "css-grid-flex",
        "josh-comeau-css",
        "mdn-css",
        "tailwind",
        "shadcn-radix",
        "mui",
        "framer-motion",
        "fastapi",
        "pydantic",
        "zod",
        "sqlalchemy",
        "alembic",
        "pytest",
        "httpx",
        "postgresql",
        "neon",
        "redis",
        "upstash",
        "prisma",
        "jwt",
        "argon2",
        "rbac",
        "rate-limiting",
        "owasp-api",
        "nextauth-better-auth",
        "vercel-ai-sdk",
        "openai-sdk",
        "cursor",
        "agent-browser",
        "google-stitch",
        "lovable",
        "framer-ai",
        "github-copilot",
        "v0",
        "bolt",
        "coderabbit",
        "continue-dev",
        "windsurf",
        "tanstack-query",
        "chrome-devtools",
        "react-devtools",
        "typescript",
        "lighthouse",
        "ext-react-devtools",
        "ext-whatfont",
        "ext-colorzilla",
        "ext-json-formatter",
        "ext-wappalyzer",
        "pnpm",
        "figma",
        "vercel",
        "github",
    }
)

REACTION_TARGET_IDS: dict[str, frozenset[str]] = {
    "case_study": CASE_STUDY_IDS,
    "portfolio": PORTFOLIO_IDS,
    "note": NOTE_IDS,
    "knowledge": KNOWLEDGE_IDS,
}

HEALTH_TARGETS: dict[str, str] = {
    "jaios": "https://jaisehgal.com",
    "quickpad": "https://quickpad.jaisehgal.com",
    "formforge": "https://formforge.jaisehgal.com",
}
