import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./users.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/nevbar/Navbar";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetch("http://93.127.198.108:5000/users/all")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then((data) => {
          const sortedUsers = data.users.sort((a, b) => {
            // Sort by 'userId' in descending order
            return b.user_id - a.user_id;
          });
          setUsers(sortedUsers);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleSave = () => {
    fetch(`http://93.127.198.108:5000/users/edit/${editUser.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editUser)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update user with ID ${editUser.user_id}`);
        }
        setEditUser(null);
        return response.json();
      })
      .then((data) => {
        const updatedUsers = users.map((user) =>
          user.user_id === editUser.user_id ? data.user : user
        );
        setUsers(updatedUsers);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleDelete = (id) => {
    fetch(`http://93.127.198.108:5000/users/delete/${id}`, {
      method: "DELETE"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete user with ID ${id}`);
        }
        setUsers(users.filter((user) => user.user_id !== id));
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="main-cont1">
          <br />
          <Link to="/addUser">
            <Button>Add Users</Button>
          </Link>
          <br />
          <div className="table-container">
            <Table bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Name</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td style={{ textAlign: "start" }}>{user.name}</td>
                    <td style={{ textAlign: "start" }}>{user.type}</td>
                    <td style={{ textAlign: "start" }}>{user.email}</td>
                    <td style={{ textAlign: "start" }}>+94 {user.phone}</td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        role="img"
                        aria-label="edit"
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() => handleEdit(user)}
                      >
                        ✏️
                      </span>
                      <span
                        role="img"
                        aria-label="delete"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(user.user_id)}
                      >
                        🗑️
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {editUser && (
            <div>
              <h2>Edit User</h2>
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={editUser.name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={editUser.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </Button>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
