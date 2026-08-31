"""align loan date columns

Revision ID: 9cb446cd341c
Revises: a54a77f20c01
"""

from alembic import op
import sqlalchemy as sa


revision = "9cb446cd341c"
down_revision = "a54a77f20c01"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table(
        "loans"
    ) as batch_op:
        batch_op.alter_column(
            "start_date",
            existing_type=sa.Date(),
            type_=sa.DateTime(),
            existing_nullable=True,
        )

        batch_op.alter_column(
            "due_date",
            new_column_name="end_date",
            existing_type=sa.Date(),
            type_=sa.DateTime(),
            existing_nullable=True,
            nullable=False,
        )


def downgrade():
    with op.batch_alter_table(
        "loans"
    ) as batch_op:
        batch_op.alter_column(
            "end_date",
            new_column_name="due_date",
            existing_type=sa.DateTime(),
            type_=sa.Date(),
            existing_nullable=False,
            nullable=True,
        )

        batch_op.alter_column(
            "start_date",
            existing_type=sa.DateTime(),
            type_=sa.Date(),
            existing_nullable=True,
        )
