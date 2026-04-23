
// export default Navbar;
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../assets/STYLES/Navbar.css";

function Navbar() {

  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleLogout = () => {

    logout(); // clears token from context
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <nav className="navbar">

      <NavLink to="/" className="logo">
        ⚖ 𝑵𝒚𝒂𝒚𝒂𝒔𝒆𝒕𝒖
      </NavLink>

      <div className="navbar-container">

        <ul className="nav-links">

          {/* If NOT logged in */}
          {!token && (
            <>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/login">Login</NavLink></li>
              <li>
                <NavLink to="/register" className="btn">
                  Sign Up
                </NavLink>
              </li>
            </>
          )}

          {/* Admin Navbar */}
          {token && role === "admin" && (
            <>
              <li><NavLink to="/admin">Dashboard</NavLink></li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {/* Client Navbar */}
          {token && role === "client" && (
            <>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/client">Dashboard</NavLink></li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {/* Lawyer Navbar */}
          {token && role === "lawyer" && (
            <>
              <li><NavLink to="/lawyer">Dashboard</NavLink></li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

        </ul>

      </div>

    </nav>

  );

}

export default Navbar;