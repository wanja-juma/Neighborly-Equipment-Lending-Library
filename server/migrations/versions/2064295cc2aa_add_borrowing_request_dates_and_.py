"""add borrowing request dates and optional loan

Revision ID: 2064295cc2aa
Revises: e3deb3c840b5
Create Date: 2026-09-02 01:35:52.124851
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "2064295cc2aa"
down_revision = "e3deb3c840b5"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table(
        "borrowing_requests",
        schema=None
    ) as batch_op:

        batch_op.add_column(
            sa.Column(
                "start_date",
                sa.DateTime(),
                nullable=False
            )
        )

        batch_op.add_column(
            sa.Column(
                "end_date",
                sa.DateTime(),
                nullable=False
            )
        )

        batch_op.alter_column(
            "loan_id",
            existing_type=sa.INTEGER(),
            nullable=True
        )


def downgrade():
    with op.batch_alter_table(
        "borrowing_requests",
        schema=None
    ) as batch_op:

        batch_op.alter_column(
            "loan_id",
            existing_type=sa.INTEGER(),
            nullable=False
        )

        batch_op.drop_column(
            "end_date"
        )

        batch_op.drop_column(
            "start_date"
        )
