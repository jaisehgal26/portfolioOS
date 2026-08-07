"""API smoke tests for engagement features (no external DB required for validation tests)."""

import pytest
from fastapi.testclient import TestClient

from app.constants import CASE_STUDY_IDS, PORTFOLIO_IDS
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_reactions_get_requires_target_type():
    res = client.get("/api/v1/reactions")
    assert res.status_code == 422


def test_reactions_get_invalid_target_type():
    res = client.get("/api/v1/reactions?target_type=invalid")
    assert res.status_code == 422


def test_reactions_post_invalid_target_id():
    res = client.post(
        "/api/v1/reactions",
        json={"target_type": "case_study", "target_id": "not-a-real-id"},
    )
    assert res.status_code == 422


def test_reactions_post_invalid_target_type():
    res = client.post(
        "/api/v1/reactions",
        json={"target_type": "invalid", "target_id": "quickpad"},
    )
    assert res.status_code == 422


def test_reactions_post_valid_portfolio_target_type():
    res = client.post(
        "/api/v1/reactions",
        json={"target_type": "portfolio", "target_id": "quickpad"},
    )
    # 200 when DB is available; 503 when DATABASE_URL is unset in CI
    assert res.status_code in (200, 503)


def test_health_cron_requires_auth():
    res = client.get("/api/v1/health/cron")
    assert res.status_code in (401, 503)


def test_admin_guestbook_requires_key():
    res = client.get("/api/v1/admin/guestbook")
    assert res.status_code == 422  # missing X-Admin-Key header


def test_guestbook_post_validation():
    res = client.post("/api/v1/guestbook", json={"message": ""})
    assert res.status_code == 422


def test_case_study_ids_count():
    assert len(CASE_STUDY_IDS) == 8


def test_portfolio_ids_count():
    assert len(PORTFOLIO_IDS) == 3
