"""loan id nullable, add request dates

Revision ID: e501d5d21fa3
Revises: e3deb3c840b5
Create Date: 2026-09-02 02:38:27.618372

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e501d5d21fa3'
down_revision = 'e3deb3c840b5'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('borrowing_requests', schema=None) as batch_op:
        batch_op.alter_column('loan_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.create_foreign_key(
            'fk_borrowing_requests_user_id_users',
            'users', ['user_id'], ['id']
        )
        batch_op.drop_column('updated_at')
        batch_op.drop_column('notification')


def downgrade():
    with op.batch_alter_table('borrowing_requests', schema=None) as batch_op:
        batch_op.add_column(sa.Column('notification', sa.VARCHAR(length=255), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DATETIME(), nullable=True))
        batch_op.drop_constraint(
            'fk_borrowing_requests_user_id_users', type_='foreignkey'
        )
        batch_op.alter_column('loan_id',
               existing_type=sa.INTEGER(),
               nullable=False)