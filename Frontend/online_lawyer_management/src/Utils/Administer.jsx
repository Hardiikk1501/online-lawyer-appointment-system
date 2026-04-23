import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/STYLES/Admin.css";

const AdminRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5050/api/auth/register/admin",
        form
      );

      Swal.fire("Success", res.data.message || "Admin Registered", "success");

      // clear form
      setForm({
        name: "",
        email: "",
        password: "",
      });

    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <h2>Admin Register</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />
     

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
           <a href="/login" className="login-link">
            Already have an account? Login here.
        </a>
      </form>
    </div>
  );
};

export default AdminRegister;