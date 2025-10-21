import React, { useState } from "react";
import { Container, Nav, Navbar, Tab, Row, Col } from "react-bootstrap";
import {
  FaBoxes,
  FaMapMarkerAlt,
  FaExchangeAlt,
  FaBalanceScale,
  FaTachometerAlt,
} from "react-icons/fa";
import Products from "./components/Products";
import Locations from "./components/Locations";
import Movements from "./components/Movements";
import BalanceReport from "./components/BalanceReport";
import Dashboard from "./components/Dashboard";

function App() {
  const [key, setKey] = useState("dashboard");

  return (
    <Container fluid className="p-0" style={{ backgroundColor: "#f9f9ff", minHeight: "100vh" }}>
      <Navbar
        expand="lg"
        variant="light"
        className="shadow-sm p-3"
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "2px solid #e5e5e5",
          justifyContent: "center",
        }}
      >
        <Navbar.Brand
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#7a00cc",
            letterSpacing: "1px",
          }}
        >
          INVENTORY APP
        </Navbar.Brand>
      </Navbar>

      <Tab.Container id="left-tabs-example" activeKey={key} onSelect={(k) => setKey(k)}>
        <Row className="g-0">
          {/* Sidebar */}
          <Col sm={3} md={2} className="bg-light shadow-sm p-3" style={{ minHeight: "100vh" }}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link
                  eventKey="dashboard"
                  className="d-flex align-items-center"
                  style={{
                    color: "#4b0082",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  <FaTachometerAlt className="me-2" /> Dashboard
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="products"
                  className="d-flex align-items-center"
                  style={{
                    color: "#4b0082",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  <FaBoxes className="me-2" /> Products
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="locations"
                  className="d-flex align-items-center"
                  style={{
                    color: "#4b0082",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  <FaMapMarkerAlt className="me-2" /> Locations
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="movements"
                  className="d-flex align-items-center"
                  style={{
                    color: "#4b0082",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  <FaExchangeAlt className="me-2" /> Movements
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="balance"
                  className="d-flex align-items-center"
                  style={{
                    color: "#4b0082",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  <FaBalanceScale className="me-2" /> Balance Report
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col sm={9} md={10} className="p-4">
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <Dashboard />
              </Tab.Pane>
              <Tab.Pane eventKey="products">
                <Products />
              </Tab.Pane>
              <Tab.Pane eventKey="locations">
                <Locations />
              </Tab.Pane>
              <Tab.Pane eventKey="movements">
                <Movements />
              </Tab.Pane>
              <Tab.Pane eventKey="balance">
                <BalanceReport />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default App;