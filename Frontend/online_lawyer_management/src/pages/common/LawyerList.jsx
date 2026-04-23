import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/STYLES/LawyerList.css";

function LawyerList() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    minExp: "",
    maxFee: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const specialization = queryParams.get("specialization");

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5050/api/lawyers?specialization=${specialization}`
        );

        setLawyers(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (specialization) {
      fetchLawyers();
    }
  }, [specialization]);

  /* ===== FILTER LOGIC (FIXED) ===== */
  const filteredLawyers = lawyers.filter((lawyer) => {
    const minExp = filters.minExp ? Number(filters.minExp) : 0;
    const maxFee = filters.maxFee ? Number(filters.maxFee) : Infinity;

    return (
      lawyer.experience >= minExp &&
      lawyer.consultationFee <= maxFee
    );
  });

  return (
    <div className="lawyer-list-container">
      <h2 className="page-title">
        Specialization - <span>{specialization}</span>
      </h2>

      {/* ===== FILTER BAR ===== */}
      <div className="filter-bar">
        <input
          type="number"
          placeholder="Min Experience (years)"
          value={filters.minExp}
          onChange={(e) =>
            setFilters({ ...filters, minExp: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Max Fee (₹)"
          value={filters.maxFee}
          onChange={(e) =>
            setFilters({ ...filters, maxFee: e.target.value })
          }
        />

        <button
          className="clear-btn"
          onClick={() => setFilters({ minExp: "", maxFee: "" })}
        >
          Clear
        </button>
      </div>

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="lawyer-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="lawyer-card skeleton-card">
              <div className="skeleton skeleton-avatar"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text small"></div>
              <div className="skeleton skeleton-text small"></div>
              <div className="skeleton skeleton-btn"></div>
            </div>
          ))}
        </div>
      ) : filteredLawyers.length === 0 ? (
        <p className="no-lawyers">No lawyers found</p>
      ) : (
        <div className="lawyer-grid">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer._id} className="lawyer-card">

              {/* ===== HEADER ===== */}
              <div className="lawyer-header">
                <div className="lawyer-info">
                  <div className="name-row">
                    <h3>{lawyer.name}</h3>

                    {lawyer.isVerified && (
                      <span className="verified-badge">✔</span>
                    )}
                  </div>

                  <span className="badge">{lawyer.specialization}</span>
                </div>

              <div
  className="avatar1 clickable-avatar"
  onClick={() => navigate(`/lawyer/${lawyer._id}`)}
>
  {lawyer.profileImage ? (
    <img
      src={lawyer.profileImage}
      alt={lawyer.name}
      className="avatar1-img"
    />
  ) : (
    lawyer.name.charAt(0)
  )}
</div>
              </div>

              {/* ===== DETAILS ===== */}
              <p>
                <strong>Experience:</strong> {lawyer.experience} years
              </p>
              <p>
                <strong>Consultation Fee:</strong> ₹{lawyer.consultationFee}
              </p>

              {/* ===== BUTTON ===== */}
              <button
                className="profile-btn"
                onClick={() => navigate(`/lawyer/${lawyer._id}`)}
              >
                Show Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LawyerList;