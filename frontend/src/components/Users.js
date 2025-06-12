import React, { useEffect, useState } from "react";
import "./Users.css";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const mobileRegex = /^[0-9]{10}$/;

    const fullName = String(currentUser.fullName || "").trim();
    const email = String(currentUser.email || "").trim();
    const password = String(currentUser.password || "").trim();
    const mobile = String(currentUser.mobile || "").trim();
    const age = String(currentUser.age || "").trim();
    const address = String(currentUser.address || "").trim();

    if (!fullName) {
      newErrors.fullName = "Name is required";
    } else if (!nameRegex.test(fullName)) {
      newErrors.fullName = "Name must contain only letters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number & special character";
    }

    if (!mobile) {
      newErrors.mobile = "Mobile is required";
    } else if (!mobileRegex.test(mobile)) {
      newErrors.mobile = "Mobile must be 10 digits Number";
    }

    if (!age) {
      newErrors.age = "Age is required";
    } else if (isNaN(age) || parseInt(age) <= 0) {
      newErrors.age = "Enter a valid age";
    }

    if (!address) {
      newErrors.address = "Address is required";
    }

    return newErrors;
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_Backend_URL}/api/user`);
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_Backend_URL}/api/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setShowForm(true);
    setErrors({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_Backend_URL}/api/user/${currentUser._id}`,
        currentUser
      );
      fetchUsers();
      setShowForm(false);
      alert("user updated successfully")
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Error updatind user",error)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="users-wrapper">
      <div>
        <h1>User List</h1>
        <table className="users-table">
          <thead>
            <tr>
              <th className="border border-black px-4 py-2">Full Name</th>
              <th className="border border-black px-4 py-2">Email</th>
              <th className="border border-black px-4 py-2">Mobile</th>
              <th className="border border-black px-4 py-2">Age</th>
              <th className="border border-black px-4 py-2">Address</th>
              <th className="border border-black px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border border-black px-4 py-2">{user.fullName}</td>
                <td className="border border-black px-4 py-2">{user.email}</td>
                <td className="border border-black px-4 py-2">{user.mobile}</td>
                <td className="border border-black px-4 py-2">{user.age}</td>
                <td className="border border-black px-4 py-2">{user.address}</td>
                <td className="border border-black px-4 py-2">
                  <button
                    className="action-button update"
                    onClick={() => handleEditClick(user)}
                  >
                    Update
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && currentUser && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Update User</h2>
              <form onSubmit={handleUpdateSubmit}>
                {[
                  "fullName",
                  "email",
                  "password",
                  "mobile",
                  "age",
                  "address",
                ].map((field) => (
                  <div key={field} className="form-group">
                    <label>{field}</label>
                    <input
                      type={field === "password" ? "password" : "text"}
                      name={field}
                      value={currentUser[field] ?? ""}
                      onChange={handleInputChange}
                    />
                    {errors[field] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
