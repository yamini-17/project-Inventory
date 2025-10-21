import React, { useEffect, useState } from "react";
import { movementsAPI, productsAPI, locationsAPI } from "../api";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function Movements() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ product_id: "", from_location: "", to_location: "", qty: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      setProducts(await productsAPI.list());
      setLocations(await locationsAPI.list());
      const movs = await movementsAPI.list();
      setMovements(movs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleShow(item = null) {
    setEditItem(item);
    setForm(item ? {
      product_id: item.product_id,
      from_location: item.from_location || "",
      to_location: item.to_location || "",
      qty: item.qty
    } : { product_id: "", from_location: "", to_location: "", qty: 1 });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.product_id || form.qty < 1) return alert("Product and Qty are required");

    try {
      if (editItem) {
        await movementsAPI.update(editItem.movement_id, form);
      } else {
        await movementsAPI.create(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to save movement");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this movement?")) return;
    try {
      await movementsAPI.delete(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete movement");
    }
  }

  const getProductName = (id) => products.find(p => p.product_id === id)?.name || id;
  const getLocationName = (id) => locations.find(l => l.location_id === id)?.name || id;

  return (
    <div style={{ backgroundColor: "#3d0075", minHeight: "100vh", padding: "20px", color: "white", borderRadius: "8px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title">Product Movements <span className="stat-badge">{movements.length}</span></h2>
        <Button variant="primary" onClick={() => handleShow()} style={{ backgroundColor: "#6a0dad", border: "none" }}>
          <FaPlus className="me-2" /> Add Movement
        </Button>
      </div>

      <Table striped bordered hover responsive style={{ backgroundColor: "#f8f8ff", color: "black" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>From</th>
            <th>To</th>
            <th>Qty</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!loading && movements.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center small-muted p-4">
                No movements yet — click "Add Movement" to create one.
              </td>
            </tr>
          )}

          {movements.map(m => (
            <tr key={m.movement_id}>
              <td>{m.movement_id}</td>
              <td>{getProductName(m.product_id)}</td>
              <td>{m.from_location ? getLocationName(m.from_location) : "-"}</td>
              <td>{m.to_location ? getLocationName(m.to_location) : "-"}</td>
              <td>{m.qty}</td>
              <td>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleShow(m)} title="Edit">
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(m.movement_id)} title="Delete">
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}

          {loading && (
            <tr><td colSpan="6" className="text-center small-muted p-4">Loading...</td></tr>
          )}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editItem ? "Edit Movement" : "Add Movement"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Product</Form.Label>
              <Form.Select value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })} required>
                <option value="">-- select product --</option>
                {products.map(p => <option key={p.product_id} value={p.product_id}>{p.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>From Location</Form.Label>
              <Form.Select value={form.from_location} onChange={e => setForm({ ...form, from_location: e.target.value })}>
                <option value="">-- external --</option>
                {locations.map(l => <option key={l.location_id} value={l.location_id}>{l.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>To Location</Form.Label>
              <Form.Select value={form.to_location} onChange={e => setForm({ ...form, to_location: e.target.value })}>
                <option value="">-- external --</option>
                {locations.map(l => <option key={l.location_id} value={l.location_id}>{l.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: Number(e.target.value) })} required />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" style={{ backgroundColor: "#6a0dad", border: "none" }} onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
