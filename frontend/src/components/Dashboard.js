import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FaBox, FaMapMarkerAlt, FaExchangeAlt } from "react-icons/fa";
import { productsAPI, locationsAPI, movementsAPI } from "../api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      setProducts(await productsAPI.list());
      setLocations(await locationsAPI.list());
      setMovements(await movementsAPI.list());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const cardStyle = { 
    backgroundColor: "#f8f8ff", 
    color: "#000", 
    borderRadius: "10px", 
    padding: "20px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    gap: "10px",
    textAlign: "center"
  };
  const iconStyle = { fontSize: "36px", color: "#6a0dad" };
  const numberStyle = { fontSize: "36px", fontWeight: "bold" };

  return (
    <div style={{ backgroundColor: "#3d0075", minHeight: "100vh", padding: "20px", color: "white" }}>
      <h2 className="mb-4 text-center">Dashboard</h2>
      <Button 
        variant="primary" 
        onClick={loadData} 
        style={{ backgroundColor: "#6a0dad", border: "none", marginBottom: "20px", display: "block", marginLeft: "auto", marginRight: "auto" }}
      >
        Refresh Data
      </Button>

      <Row className="g-3 justify-content-center">
        <Col md={3}>
          <Card style={cardStyle}>
            <FaBox style={iconStyle} />
            <Card.Title>Total Products</Card.Title>
            <Card.Text style={numberStyle}>{products.length}</Card.Text>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={cardStyle}>
            <FaMapMarkerAlt style={iconStyle} />
            <Card.Title>Total Locations</Card.Title>
            <Card.Text style={numberStyle}>{locations.length}</Card.Text>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={cardStyle}>
            <FaExchangeAlt style={iconStyle} />
            <Card.Title>Total Movements</Card.Title>
            <Card.Text style={numberStyle}>{movements.length}</Card.Text>
          </Card>
        </Col>
      </Row>

      {loading && <p className="mt-3 text-center">Loading...</p>}
    </div>
  );
}
