// This page lets an Admin see all staff accounts, add a new one, and
// turn accounts on or off.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";

export default function ManageStaff() {
  const [staffList, setStaffList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [newStaff, setNewStaff] = useState({
    name: "",
    username: "",
    password: "",
    role: "staff",
  });

  async function loadStaff() {
    const response = await api.get("/staff");
    setStaffList(response.data);
  }

  useEffect(() => {
    loadStaff();
  }, []);

  async function handleAddStaff(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      await api.post("/staff", newStaff);
      setNewStaff({ name: "", username: "", password: "", role: "staff" });
      loadStaff();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not add staff account.");
    }
  }

  async function handleToggleActive(staffId) {
    await api.put(`/staff/${staffId}/toggle-active`);
    loadStaff();
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <Link to="/products">&larr; Back to Products</Link>
      <h2>Manage Staff Accounts</h2>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((person) => (
            <tr key={person._id} style={{ borderBottom: "1px solid #eee", opacity: person.active ? 1 : 0.5 }}>
              <td>{person.name}</td>
              <td>{person.username}</td>
              <td>{person.role}</td>
              <td>{person.active ? "Active" : "Deactivated"}</td>
              <td>
                <button onClick={() => handleToggleActive(person._id)} style={{ padding: "4px 10px" }}>
                  {person.active ? "Deactivate" : "Reactivate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAddStaff} style={{ marginTop: 30, borderTop: "1px solid #eee", paddingTop: 20 }}>
        <h3>Add Staff Account</h3>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <input
          placeholder="name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          placeholder="username"
          value={newStaff.username}
          onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
          style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="password"
          value={newStaff.password}
          onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
          style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
        />
        <select
          value={newStaff.role}
          onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
          style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={{ padding: 10, background: "black", color: "white", border: "none" }}>
          Save staff account
        </button>
      </form>
    </div>
  );
}
