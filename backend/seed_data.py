from app import create_app
from models import db, Product, Location, ProductMovement
from uuid import uuid4
from datetime import datetime, timedelta
import random

app = create_app()
with app.app_context():
    db.create_all()

    # Create products
    products = [
        Product(product_id="P-A", name="Product A", description="Product A desc"),
        Product(product_id="P-B", name="Product B", description="Product B desc"),
        Product(product_id="P-C", name="Product C", description="Product C desc"),
        Product(product_id="P-D", name="Product D", description="Product D desc"),
    ]
    db.session.add_all(products)

    # Create locations
    locations = [
        Location(location_id="L-X", name="Location X", address="Warehouse X"),
        Location(location_id="L-Y", name="Location Y", address="Warehouse Y"),
        Location(location_id="L-Z", name="Location Z", address="Warehouse Z"),
    ]
    db.session.add_all(locations)
    db.session.commit()

    # Seed ~20 movements
    base_time = datetime.utcnow() - timedelta(days=20)
    movements = []
    for i in range(20):
        prod = random.choice(products)
        choice = random.choice(["in", "out", "between"])
        qty = random.randint(1, 10)
        timestamp = base_time + timedelta(hours=i * 12)
        if choice == "in":
            m = ProductMovement(
                movement_id=f"M-{i}-{uuid4().hex[:6]}",
                timestamp=timestamp,
                from_location=None,
                to_location=random.choice(locations).location_id,
                product_id=prod.product_id,
                qty=qty
            )
        elif choice == "out":
            m = ProductMovement(
                movement_id=f"M-{i}-{uuid4().hex[:6]}",
                timestamp=timestamp,
                from_location=random.choice(locations).location_id,
                to_location=None,
                product_id=prod.product_id,
                qty=qty
            )
        else:
            a = random.choice(locations).location_id
            b = random.choice(locations).location_id
            if a == b:
                b = locations[(locations.index(next(filter(lambda x: x.location_id==a, locations)))+1) % len(locations)].location_id
            m = ProductMovement(
                movement_id=f"M-{i}-{uuid4().hex[:6]}",
                timestamp=timestamp,
                from_location=a,
                to_location=b,
                product_id=prod.product_id,
                qty=qty
            )
        movements.append(m)

    db.session.add_all(movements)
    db.session.commit()
    print("Seeded DB with products, locations and movements.")
