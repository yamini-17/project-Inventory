import React, { useEffect, useState } from "react";
import { productsAPI } from "../api";
import { Table, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await productsAPI.list();
    setProducts(data || []);
  }

  async function addProduct(e) {
    e.preventDefault();
    if (editingId) {
      await productsAPI.update(editingId, { name, description });
      setEditingId(null);
    } else {
      await productsAPI.create({ name, description });
    }
    setName(""); 
    setDescription("");
    load();
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    await productsAPI.delete(id);
    if (editingId === id) {
      setName("");
      setDescription("");
      setEditingId(null);
    }
    load();
  }

  function handleEdit(id) {
    const product = products.find(p => p.product_id === id);
    if (!product) return;
    setName(product.name);
    setDescription(product.description);
    setEditingId(id);
  }

  return (
    <div style={{ backgroundColor: "#3d0075", minHeight: "100vh", padding: "20px", color: "white", borderRadius: "8px" }}>
      <h2 className="mb-4">Products</h2>
      <Form onSubmit={addProduct} className="mb-3">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" style={{ backgroundColor: "#8a2be2", border: "none" }}>
          {editingId ? "Update Product" : "Add Product"}
        </Button>
      </Form>

      <Table striped bordered hover responsive style={{ backgroundColor: "#f8f8ff", color: "black" }}>
        <thead>
          <tr>
            <th>ID</th> {/* ✅ Added ID column */}
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td> {/* ✅ Display product_id */}
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(p.product_id)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => deleteProduct(p.product_id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
