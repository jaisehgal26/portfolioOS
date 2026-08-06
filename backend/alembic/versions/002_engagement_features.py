"""engagement features tables

Revision ID: 002
Revises: 001
Create Date: 2026-08-06

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "reaction_events",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("target_type", sa.String(length=32), nullable=False),
        sa.Column("target_id", sa.String(length=64), nullable=False),
        sa.Column("visitor_hash", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("target_type", "target_id", "visitor_hash", name="uq_reaction_events_visitor"),
    )
    op.create_index("ix_reaction_events_target", "reaction_events", ["target_type", "target_id"])

    op.create_table(
        "health_check_latest",
        sa.Column("target_key", sa.String(length=32), nullable=False),
        sa.Column("url", sa.String(length=512), nullable=False),
        sa.Column("status", sa.String(length=8), nullable=False),
        sa.Column("status_code", sa.Integer(), nullable=True),
        sa.Column("latency_ms", sa.Integer(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("checked_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("target_key"),
    )

    op.create_table(
        "guestbook_entries",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="pending"),
        sa.Column("name", sa.String(length=100), nullable=True),
        sa.Column("email", sa.String(length=320), nullable=True),
        sa.Column("message", sa.String(length=500), nullable=False),
        sa.Column("is_anonymous", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("visitor_hash", sa.String(length=64), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_guestbook_entries_status_created",
        "guestbook_entries",
        ["status", "created_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_guestbook_entries_status_created", table_name="guestbook_entries")
    op.drop_table("guestbook_entries")
    op.drop_table("health_check_latest")
    op.drop_index("ix_reaction_events_target", table_name="reaction_events")
    op.drop_table("reaction_events")
