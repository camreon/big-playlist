"""add stream url expiry to tracks

Revision ID: 8f2c1a4b7d3e
Revises: 62f9339e4800
Create Date: 2026-09-21 12:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f2c1a4b7d3e'
down_revision = '62f9339e4800'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tracks', sa.Column('stream_url_expires_at', sa.DateTime()))


def downgrade():
    op.drop_column('tracks', 'stream_url_expires_at')
