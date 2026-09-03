"""merge migration heads

Revision ID: c45bcb5171ba
Revises: 2064295cc2aa, e501d5d21fa3
Create Date: 2026-09-02 22:57:30.813163

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c45bcb5171ba'
down_revision = ('2064295cc2aa', 'e501d5d21fa3')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
