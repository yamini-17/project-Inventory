from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from uuid import uuid4

db = SQLAlchemy()

# ----------------- Product Table -----------------
class Product(db.Model):
    __tablename__ = "products"
    product_id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "name": self.name,
            "description": self.description
        }

# ----------------- Location Table -----------------
class Location(db.Model):
    __tablename__ = "locations"
    location_id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String)

    def to_dict(self):
        return {
            "location_id": self.location_id,
            "name": self.name,
            "address": self.address
        }

# ----------------- Product Movement Table -----------------
class ProductMovement(db.Model):
    __tablename__ = "movements"
    movement_id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    from_location = db.Column(db.String, db.ForeignKey('locations.location_id'), nullable=True)
    to_location = db.Column(db.String, db.ForeignKey('locations.location_id'), nullable=True)
    product_id = db.Column(db.String, db.ForeignKey('products.product_id'), nullable=False)
    qty = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "movement_id": self.movement_id,
            "timestamp": self.timestamp.isoformat(),
            "from_location": self.from_location,
            "to_location": self.to_location,
            "product_id": self.product_id,
            "qty": self.qty
        }
