import React from 'react'
import "../../assets/STYLES/About.css";

function About() {
  return (
      <div className="about-container">

      {/* Hero Section */}
    
      <section className="about-hero">
        <h1>About Our Legal Platform</h1>
        <p>
          Connecting Clients with Verified Lawyers — Simple, Secure, Reliable.
        </p>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <div className="about-text">
          <h2>Our Mission</h2>
          <p>
            Our mission is to simplify the legal process by connecting clients
            with trusted and verified lawyers. We aim to provide a secure,
            transparent, and easy-to-use legal service platform.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-features">
        <h2>Why Choose Us?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>⚖️ Verified Lawyers</h3>
            <p>All lawyers are verified by admin.</p>
          </div>
          <div className="feature-card">
            <h3>📅 Easy Appointments</h3>
            <p>Book consultations quickly and easily.</p>
          </div>
          <div className="feature-card">
            <h3>💬 Secure Chat</h3>
            <p>Communicate privately and securely.</p>
          </div>
          <div className="feature-card">
            <h3>💳 Secure Payments</h3>
            <p>Safe and protected payment system.</p>
          </div>
        </div>
      </section>

      

    </div>
  );
}

export default About