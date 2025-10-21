import React, { useEffect, useState } from "react";
import { locationsAPI } from "../api";
import { Table, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLocations(await locationsAPI.list());
  }

  async function addLocation(e) {
    e.preventDefault();
    if (editingId) {
      // Update existing location
      await locationsAPI.update(editingId, { name, address });
      setEditingId(null);
    } else {
      // Create new location
      await locationsAPI.create({ name, address });
    }
    setName("");
    setAddress("");
    load();
  }

  async function deleteLocation(id) {
    if (!window.confirm("Delete this location?")) return;
    await locationsAPI.delete(id);
    // Reset form if deleting the location being edited
    if (editingId === id) {
      setName("");
      setAddress("");
      setEditingId(null);
    }
    load();
  }

  function handleEdit(id) {
    const loc = locations.find(l => l.location_id === id);
    if (!loc) return;
    setName(loc.name);
    setAddress(loc.address);
    setEditingId(id);
  }

  return (
    <div style={{ backgroundColor: "#3d0075", minHeight: "100vh", padding: "20px", color: "white", borderRadius: "8px" }}>
      <h2 className="mb-4">Locations</h2>
      <Form onSubmit={addLocation} className="mb-3">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Location Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" style={{ backgroundColor: "#8a2be2", border: "none" }}>
          {editingId ? "Update Location" : "Add Location"}
        </Button>
      </Form>

      <Table striped bordered hover responsive style={{ backgroundColor: "#f8f8ff", color: "black" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(l => (
            <tr key={l.location_id}>
              <td>{l.location_id}</td>
              <td>{l.name}</td>
              <td>{l.address}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(l.location_id)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => deleteLocation(l.location_id)}>
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
