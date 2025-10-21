import React, { useEffect, useState } from "react";
import { reportAPI, productsAPI, locationsAPI } from "../api";
import { Table, Button } from "react-bootstrap";

export default function BalanceReport() {
  const [rows, setRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    setProducts(await productsAPI.list());
    setLocations(await locationsAPI.list());
    const allRows = await reportAPI.balance();
    setRows(allRows.filter(r => r.qty > 0)); // remove negative or zero
  }

  const getProductName = (id) => products.find(p => p.product_id === id)?.name || id;
  const getLocationName = (id) => locations.find(l => l.location_id === id)?.name || id;

  return (
    <div style={{ backgroundColor: "#3d0075", minHeight: "100vh", padding: "20px", color: "white", borderRadius: "8px" }}>
      <h2 className="mb-4">Balance Report (Product / Warehouse / Qty)</h2>
      <Button variant="secondary" className="mb-3" onClick={load} style={{ backgroundColor: "#8a2be2", border: "none" }}>Refresh</Button>

      <Table striped bordered hover responsive style={{ backgroundColor: "#f8f8ff", color: "black" }}>
        <thead>
          <tr><th>Product</th><th>Warehouse</th><th>Qty</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan="3">No balances (maybe no movements)</td></tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={idx}>
                <td>{getProductName(r.product_id)}</td>
                <td>{getLocationName(r.location_id)}</td>
                <td>{r.qty}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
