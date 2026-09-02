from datetime import datetime, timedelta, timezone
from decimal import Decimal

from app import create_app
from app.extensions import db

from models import (
    User,
    Profile,
    Membership,
    Category,
    Item,
    BorrowingRequest,
    Loan,
    Payment,
    DamageReport,
)


app = create_app()


def seed_database():
    with app.app_context():

        print("Clearing existing data...")

        # Delete in dependency-safe order.
        DamageReport.query.delete()
        Payment.query.delete()
        BorrowingRequest.query.delete()
        Loan.query.delete()
        Item.query.delete()
        Membership.query.delete()
        Profile.query.delete()
        Category.query.delete()
        User.query.delete()

        db.session.commit()

        print("Creating users...")

        # -------------------------------------------------
        # USERS
        # -------------------------------------------------

        wanja = User(
            email="wanja@example.com"
        )
        wanja.password = "password123"

        danny = User(
            email="danny@example.com"
        )
        danny.password = "password123"

        grace = User(
            email="grace@example.com"
        )
        grace.password = "password123"

        brian = User(
            email="brian@example.com"
        )
        brian.password = "password123"

        users = [
            wanja,
            danny,
            grace,
            brian,
        ]

        db.session.add_all(users)
        db.session.flush()

        # -------------------------------------------------
        # PROFILES
        # -------------------------------------------------

        print("Creating profiles...")

        profiles = [
            Profile(
                user=wanja,
                first_name="Wanja",
                last_name="Juma",
                phone_number="+254712345678",
                address="Westlands, Nairobi",
                bio="DIY enthusiast who enjoys sharing tools with neighbours.",
            ),
            Profile(
                user=danny,
                first_name="Danny",
                last_name="Mwangi",
                phone_number="+254723456789",
                address="Kilimani, Nairobi",
                bio="Home improvement enthusiast.",
            ),
            Profile(
                user=grace,
                first_name="Grace",
                last_name="Njeri",
                phone_number="+254734567890",
                address="Lavington, Nairobi",
                bio="Gardening and outdoor equipment enthusiast.",
            ),
            Profile(
                user=brian,
                first_name="Brian",
                last_name="Otieno",
                phone_number="+254745678901",
                address="Parklands, Nairobi",
                bio="I enjoy repairing and building things around the house.",
            ),
        ]

        db.session.add_all(profiles)

        # -------------------------------------------------
        # MEMBERSHIPS
        # -------------------------------------------------

        print("Creating memberships...")

        today = datetime.now(timezone.utc).date()

        memberships = [
            Membership(
                user=wanja,
                status="active",
                start_date=today - timedelta(days=180),
            ),
            Membership(
                user=danny,
                status="active",
                start_date=today - timedelta(days=120),
            ),
            Membership(
                user=grace,
                status="active",
                start_date=today - timedelta(days=90),
            ),
            Membership(
                user=brian,
                status="active",
                start_date=today - timedelta(days=60),
            ),
        ]

        db.session.add_all(memberships)

        # -------------------------------------------------
        # CATEGORIES
        # -------------------------------------------------

        print("Creating categories...")

        power_tools = Category(
            name="Power Tools",
            description="Electric and battery-powered tools.",
        )

        hand_tools = Category(
            name="Hand Tools",
            description="Manual tools used for repairs and construction.",
        )

        gardening = Category(
            name="Gardening",
            description="Tools and equipment used for gardening.",
        )

        cleaning = Category(
            name="Cleaning Equipment",
            description="Equipment used for household and outdoor cleaning.",
        )

        outdoor = Category(
            name="Outdoor Equipment",
            description="Equipment for outdoor maintenance and activities.",
        )

        categories = [
            power_tools,
            hand_tools,
            gardening,
            cleaning,
            outdoor,
        ]

        db.session.add_all(categories)
        db.session.flush()

        # -------------------------------------------------
        # ITEMS
        # -------------------------------------------------

        print("Creating items...")

        drill = Item(
            owner=wanja,
            name="Cordless Drill",
            description="18V cordless drill with two batteries and charger.",
            category=power_tools,
            condition="Good",
            status="Available",
            image="https://images.example.com/drill.jpg",
        )

        hammer = Item(
            owner=wanja,
            name="Claw Hammer",
            description="Strong claw hammer suitable for household repairs.",
            category=hand_tools,
            condition="Excellent",
            status="Available",
            image="https://images.example.com/hammer.jpg",
        )

        pressure_washer = Item(
            owner=wanja,
            name="Pressure Washer",
            description="Electric pressure washer suitable for cars and patios.",
            category=cleaning,
            condition="Good",
            status="Available",
            image="https://images.example.com/pressure-washer.jpg",
        )

        lawnmower = Item(
            owner=danny,
            name="Electric Lawnmower",
            description="Electric lawnmower suitable for small and medium gardens.",
            category=gardening,
            condition="Good",
            status="Available",
            image="https://images.example.com/lawnmower.jpg",
        )

        ladder = Item(
            owner=danny,
            name="Extension Ladder",
            description="Strong aluminium extension ladder for household use.",
            category=outdoor,
            condition="Excellent",
            status="Available",
            image="https://images.example.com/ladder.jpg",
        )

        hedge_trimmer = Item(
            owner=grace,
            name="Hedge Trimmer",
            description="Electric hedge trimmer for maintaining garden hedges.",
            category=gardening,
            condition="Good",
            status="Available",
            image="https://images.example.com/hedge-trimmer.jpg",
        )

        circular_saw = Item(
            owner=grace,
            name="Circular Saw",
            description="Circular saw suitable for woodworking projects.",
            category=power_tools,
            condition="Good",
            status="Available",
            image="https://images.example.com/circular-saw.jpg",
        )

        tool_set = Item(
            owner=brian,
            name="Hand Tool Set",
            description="Complete household hand tool set with screwdrivers and pliers.",
            category=hand_tools,
            condition="Excellent",
            status="Available",
            image="https://images.example.com/tool-set.jpg",
        )

        items = [
            drill,
            hammer,
            pressure_washer,
            lawnmower,
            ladder,
            hedge_trimmer,
            circular_saw,
            tool_set,
        ]

        db.session.add_all(items)
        db.session.flush()

        # -------------------------------------------------
        # DATES
        # -------------------------------------------------

        now = datetime.now(timezone.utc)

        # -------------------------------------------------
        # LOANS
        # -------------------------------------------------

        print("Creating loans...")

        # Wanja borrows Danny's lawnmower.
        lawnmower_loan = Loan(
            item=lawnmower,
            borrower=wanja,
            start_date=now,
            end_date=now + timedelta(days=4),
            requested_at=now - timedelta(days=2),
            approved_at=now - timedelta(days=1),
            status="Active",
        )

        # Danny borrows Wanja's drill.
        drill_loan = Loan(
            item=drill,
            borrower=danny,
            start_date=now - timedelta(days=2),
            end_date=now + timedelta(days=2),
            requested_at=now - timedelta(days=5),
            approved_at=now - timedelta(days=4),
            status="Active",
        )

        # Brian previously borrowed Grace's circular saw.
        saw_loan = Loan(
            item=circular_saw,
            borrower=brian,
            start_date=now - timedelta(days=10),
            end_date=now - timedelta(days=5),
            requested_at=now - timedelta(days=13),
            approved_at=now - timedelta(days=12),
            returned_at=now - timedelta(days=4),
            status="Returned",
        )

        loans = [
            lawnmower_loan,
            drill_loan,
            saw_loan,
        ]

        db.session.add_all(loans)
        db.session.flush()

        # -------------------------------------------------
        # BORROWING REQUESTS
        # -------------------------------------------------

        print("Creating borrowing requests...")

        borrowing_requests = [
            # Approved request connected to lawnmower loan.
            BorrowingRequest(
                user=wanja,
                item=lawnmower,
                loan=lawnmower_loan,
                start_date=lawnmower_loan.start_date,
                end_date=lawnmower_loan.end_date,
                status="approved",
                request_date=now - timedelta(days=2),
                message="I would like to borrow the lawnmower for my garden.",
            ),

            # Approved request connected to drill loan.
            BorrowingRequest(
                user=danny,
                item=drill,
                loan=drill_loan,
                start_date=drill_loan.start_date,
                end_date=drill_loan.end_date,
                status="approved",
                request_date=now - timedelta(days=5),
                message="I need the drill for a small home repair.",
            ),

            # Completed historical request.
            BorrowingRequest(
                user=brian,
                item=circular_saw,
                loan=saw_loan,
                start_date=saw_loan.start_date,
                end_date=saw_loan.end_date,
                status="approved",
                request_date=now - timedelta(days=13),
                message="I need the saw for a woodworking project.",
            ),

            # Pending request.
            BorrowingRequest(
                user=grace,
                item=ladder,
                start_date=now + timedelta(days=3),
                end_date=now + timedelta(days=5),
                status="pending",
                request_date=now,
                message="Could I borrow the ladder this weekend?",
            ),

            # Another pending request.
            BorrowingRequest(
                user=brian,
                item=pressure_washer,
                start_date=now + timedelta(days=7),
                end_date=now + timedelta(days=8),
                status="pending",
                request_date=now,
                message="I would like to clean my driveway.",
            ),
        ]

        db.session.add_all(borrowing_requests)

        # -------------------------------------------------
        # PAYMENTS
        # -------------------------------------------------

        print("Creating payments...")

        payments = [
            Payment(
                loan=lawnmower_loan,
                amount=Decimal("500.00"),
                status="held",
                paid_at=now - timedelta(hours=12),
            ),
            Payment(
                loan=drill_loan,
                amount=Decimal("350.00"),
                status="held",
                paid_at=now - timedelta(days=2),
            ),
            Payment(
                loan=saw_loan,
                amount=Decimal("450.00"),
                status="refunded",
                paid_at=now - timedelta(days=10),
                refunded_at=now - timedelta(days=4),
            ),
        ]

        db.session.add_all(payments)

        # -------------------------------------------------
        # DAMAGE REPORT
        # -------------------------------------------------

        print("Creating damage reports...")

        damage_report = DamageReport(
            loan=saw_loan,
            status="pending",
            severity="minor",
            notes="Small scratch noticed on the protective casing after return.",
            item_image="https://images.example.com/saw-damage.jpg",
        )

        db.session.add(damage_report)

        # -------------------------------------------------
        # COMMIT
        # -------------------------------------------------

        db.session.commit()

        print("\nDatabase seeded successfully!")
        print("--------------------------------")
        print(f"Users: {User.query.count()}")
        print(f"Profiles: {Profile.query.count()}")
        print(f"Memberships: {Membership.query.count()}")
        print(f"Categories: {Category.query.count()}")
        print(f"Items: {Item.query.count()}")
        print(
            f"Borrowing Requests: "
            f"{BorrowingRequest.query.count()}"
        )
        print(f"Loans: {Loan.query.count()}")
        print(f"Payments: {Payment.query.count()}")
        print(
            f"Damage Reports: "
            f"{DamageReport.query.count()}"
        )

        print("\nTest accounts:")
        print("--------------------------------")
        print("wanja@example.com  / password123")
        print("danny@example.com  / password123")
        print("grace@example.com  / password123")
        print("brian@example.com  / password123")


if __name__ == "__main__":
    seed_database()