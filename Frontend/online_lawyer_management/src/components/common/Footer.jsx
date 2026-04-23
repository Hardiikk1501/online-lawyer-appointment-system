
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../assets/STYLES/Footer.css";

const Footer = () => {

  const { token } = useContext(AuthContext);

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-section">
          <h3>⚖ Online Lawyer System</h3>
          <p>
            A secure platform to connect clients with verified lawyers
            for professional legal consultation.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>

          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>

            {/* Show only if NOT logged in */}
            {!token && (
              <>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
              </>
            )}
          </ul>

        </div>

        {/* Contact + Map */}
        <div className="footer-section">
          <h4>Contact</h4>

          <p>Email: hardik152201@gmail.com</p>
          <p>Phone: +91 89800 56630</p>
          <p>Location: India</p>

          <div className="map">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=india&t=&z=5&ie=UTF8&iwloc=&output=embed"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Online Lawyer System. All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;

