from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers.admin import router as admin_router
from app.routers.contact import router as contact_router
from app.routers.guestbook import router as guestbook_router
from app.routers.health import router as health_router
from app.routers.reactions import router as reactions_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Portfolio API", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_methods=["GET", "POST", "PATCH"],
        allow_headers=["Content-Type", "Authorization", "X-Admin-Key"],
    )

    app.include_router(contact_router)
    app.include_router(reactions_router)
    app.include_router(health_router)
    app.include_router(guestbook_router)
    app.include_router(admin_router)

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
