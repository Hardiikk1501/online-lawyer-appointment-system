 
import { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../../assets/STYLES/Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Please fill all fields");
    }

    try {

      const API_URL = `http://localhost:5050/api/auth/login/${role}`;

      const response = await axios.post(API_URL, {
        email,
        password
      });

      if (!response.data?.token || !response.data?.user) {
        throw new Error("Invalid server response");
      }

      // Save authentication using context
      login(response.data.token);

      // Save user info
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
      localStorage.setItem("userId", response.data.user.id);

      // Save role

      localStorage.setItem("role", role);

      console.log("Login role:", role);
      console.log("Login Data:", response.data);

      // Redirect based on role
      navigate(`/${role}`);

    } catch (err) {

      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );

    }

  };
  
return (
  <div className="login-container">

    <div className="login-wrapper">

      {/* LEFT SIDE (Image / Branding) */}
      <div className="login-left">
        <div className="overlay">
          <h2>Welcome</h2>
          <p>Manage your legal services efficiently</p>
        </div>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="login-right">

        <h2 className="title">Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <div className="role-toggle">
            <label className={role === "admin" ? "active" : ""}>
              <input
                type="radio"
                value="admin"
                checked={role === "admin"}
                onChange={(e)=>setRole(e.target.value)}
              />
              Admin
            </label>

            <label className={role === "lawyer" ? "active" : ""}>
              <input
                type="radio"
                value="lawyer"
                checked={role === "lawyer"}
                onChange={(e)=>setRole(e.target.value)}
              />
              Lawyer
            </label>

            <label className={role === "client" ? "active" : ""}>
              <input
                type="radio"
                value="client"
                checked={role === "client"}
                onChange={(e)=>setRole(e.target.value)}
              />
              Client
            </label>
          </div>

          <div className="forgot">
            <NavLink to="/ForgotPassword">Forgot password?</NavLink>
          </div>

          <button type="submit">Login</button>

        </form>

      </div>

    </div>

  </div>
);
}

export default Login;