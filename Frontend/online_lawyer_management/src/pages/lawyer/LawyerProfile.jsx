
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import "../../assets/STYLES/LawyerProfile.css";

function LawyerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/lawyer/${id}`);
        setLawyer(res.data);
      } catch (err) {
        setError("Failed to load lawyer profile");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [id]);

  if (loading) return <div className="loader">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!lawyer) return <div className="error">Lawyer not found</div>;

  return (
    <div className="profile-container">
      
      {/* HEADER */}
      <div className="profile-header">
     <div className="avatar2">
  {lawyer.profileImage ? (
    <img
      src={lawyer.profileImage}
      alt={lawyer.name}
      className="avatar2-img"
    />
  ) : (
    lawyer.name.charAt(0)
  )}
</div>
        <div className="header-info">
          <h1>{lawyer.name}</h1>
          <p className="specialization">{lawyer.specialization}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="profile-stats">
        <div className="stat-card">
          <FaBriefcase />
          <span>{lawyer.experience} Years</span>
          <p>Experience</p>
        </div>

        <div className="stat-card">
          💰
          <span>₹{lawyer.consultationFee}</span>
          <p>Fee</p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="profile-details">
        <div><FaEnvelope /> {lawyer.email}</div>
        <div><FaPhone /> {lawyer.phone}</div>
        <div><FaMapMarkerAlt /> {lawyer.address}</div>
      </div>

      {/* BIO */}
      <div className="profile-bio">
        <h3>About Lawyer</h3>
        <p>{lawyer.bio}</p>
      </div>

      {/* BUTTON */}
      <button
        className="book-btn"
        onClick={() => navigate(`/book/${lawyer._id}`)}
      >

        Book Appointment
      </button>

    </div>
  );
}

export default LawyerProfile;