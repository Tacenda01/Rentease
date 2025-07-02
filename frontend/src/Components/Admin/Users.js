import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/admin/users"
        );
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "28px",
          color: "#333",
        }}
      >
        👥 Registered Users
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "16px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa", color: "#495057" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f4f6f8",
                  transition: "background-color 0.2s ease",
                }}
              >
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>
                  {user.first_name} {user.last_name}
                </td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background:
                        user.role === "admin"
                          ? "#ffc107"
                          : user.role === "tenant"
                          ? "#17a2b8"
                          : "#28a745",
                      color: "#fff",
                      fontSize: "14px",
                      textTransform: "capitalize",
                    }}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={tdStyle}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// 🔹 Styling objects
const thStyle = {
  border: "1px solid #dee2e6",
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #dee2e6",
  padding: "12px",
};

export default Users;
