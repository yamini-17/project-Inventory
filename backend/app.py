from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Product, Location, ProductMovement
import os
from uuid import uuid4
from datetime import datetime

def create_app():
    app = Flask(__name__)

    # Use absolute path for SQLite DB
    db_file = os.path.join(os.getcwd(), "instance", "inventory.db")
    os.makedirs(os.path.dirname(db_file), exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_file}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app)

    with app.app_context():
        db.create_all()  # Create tables if not exist

    # ------------------ Routes ------------------

    @app.route("/")
    def home():
        return "Flask is running!"

    # ---------- Products ----------
    @app.route("/api/products", methods=["GET"])
    def list_products():
        return jsonify([p.to_dict() for p in Product.query.all()])

    @app.route("/api/products", methods=["POST"])
    def create_product():
        data = request.json
        p = Product(product_id=data.get("product_id") or str(uuid4()),
                    name=data["name"],
                    description=data.get("description"))
        db.session.add(p)
        db.session.commit()
        return jsonify(p.to_dict()), 201

    @app.route("/api/products/<product_id>", methods=["GET"])
    def get_product(product_id):
        p = Product.query.get_or_404(product_id)
        return jsonify(p.to_dict())

    @app.route("/api/products/<product_id>", methods=["PUT"])
    def update_product(product_id):
        p = Product.query.get_or_404(product_id)
        data = request.json
        p.name = data.get("name", p.name)
        p.description = data.get("description", p.description)
        db.session.commit()
        return jsonify(p.to_dict())

    @app.route("/api/products/<product_id>", methods=["DELETE"])
    def delete_product(product_id):
        p = Product.query.get_or_404(product_id)
        db.session.delete(p)
        db.session.commit()
        return jsonify({"success": True})

    # ---------- Locations ----------
    @app.route("/api/locations", methods=["GET"])
    def list_locations():
        return jsonify([l.to_dict() for l in Location.query.all()])

    @app.route("/api/locations", methods=["POST"])
    def create_location():
        data = request.json
        l = Location(location_id=data.get("location_id") or str(uuid4()),
                     name=data["name"],
                     address=data.get("address"))
        db.session.add(l)
        db.session.commit()
        return jsonify(l.to_dict()), 201

    @app.route("/api/locations/<location_id>", methods=["GET"])
    def get_location(location_id):
        l = Location.query.get_or_404(location_id)
        return jsonify(l.to_dict())

    @app.route("/api/locations/<location_id>", methods=["PUT"])
    def update_location(location_id):
        l = Location.query.get_or_404(location_id)
        data = request.json
        l.name = data.get("name", l.name)
        l.address = data.get("address", l.address)
        db.session.commit()
        return jsonify(l.to_dict())

    @app.route("/api/locations/<location_id>", methods=["DELETE"])
    def delete_location(location_id):
        l = Location.query.get_or_404(location_id)
        db.session.delete(l)
        db.session.commit()
        return jsonify({"success": True})

    # ---------- Movements ----------
    @app.route("/api/movements", methods=["GET"])
    def list_movements():
        return jsonify([m.to_dict() for m in ProductMovement.query.order_by(ProductMovement.timestamp.desc()).all()])

    @app.route("/api/movements", methods=["POST"])
    def create_movement():
        data = request.json
        if "product_id" not in data or "qty" not in data:
            return jsonify({"error": "product_id and qty required"}), 400
        m = ProductMovement(
            movement_id=data.get("movement_id") or str(uuid4()),
            timestamp=datetime.fromisoformat(data.get("timestamp")) if data.get("timestamp") else datetime.utcnow(),
            from_location=data.get("from_location"),
            to_location=data.get("to_location"),
            product_id=data["product_id"],
            qty=int(data["qty"])
        )
        db.session.add(m)
        db.session.commit()
        return jsonify(m.to_dict()), 201

    @app.route("/api/movements/<movement_id>", methods=["GET"])
    def get_movement(movement_id):
        m = ProductMovement.query.get_or_404(movement_id)
        return jsonify(m.to_dict())

    @app.route("/api/movements/<movement_id>", methods=["PUT"])
    def update_movement(movement_id):
        m = ProductMovement.query.get_or_404(movement_id)
        data = request.json
        m.from_location = data.get("from_location", m.from_location)
        m.to_location = data.get("to_location", m.to_location)
        m.qty = int(data.get("qty", m.qty))
        db.session.commit()
        return jsonify(m.to_dict())

    @app.route("/api/movements/<movement_id>", methods=["DELETE"])
    def delete_movement(movement_id):
        m = ProductMovement.query.get_or_404(movement_id)
        db.session.delete(m)
        db.session.commit()
        return jsonify({"success": True})

    # ---------- Report ----------
    @app.route("/api/report/balance", methods=["GET"])
    def report_balance():
        movements = ProductMovement.query.order_by(ProductMovement.timestamp).all()
        balances = {}
        for m in movements:
            if m.to_location:
                key = (m.product_id, m.to_location)
                balances[key] = balances.get(key, 0) + m.qty
            if m.from_location:
                key = (m.product_id, m.from_location)
                balances[key] = balances.get(key, 0) - m.qty
        return jsonify([{"product_id": k[0], "location_id": k[1], "qty": v} for k, v in balances.items()])

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
