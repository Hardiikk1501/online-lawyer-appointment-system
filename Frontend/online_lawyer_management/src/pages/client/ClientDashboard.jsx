

import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/STYLES/ClientDashboard.css";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

function ClientDashboard() {
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
const [view, setView] = useState("profile"); 

 const navigate = useNavigate();
  const token = localStorage.getItem("token");
   const ur=import.meta.env.VITE_APP_API_URL;
  const API = `${ur}/api`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, appointmentRes] = await Promise.all([
        axios.get(`${API}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setClient(profileRes.data);
      //setAppointments(appointmentRes.data);
       const data = appointmentRes.data;
    setAppointments(Array.isArray(data) ? data : data.appointments || []);

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = async (id) => {
  try {
    await axios.delete(
  `${API}/appointments/cancel/${id}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
    Swal.fire("Deleted!", "Appointment removed successfully.", "success");
    
    // Refresh data (better than reload)
    fetchData();

  } catch (err) {
    console.error(err);
    alert("Cancel failed");
  }
};

const counts = {
  All: appointments.length,
  pending: appointments.filter(a => a.status === "pending").length,
  approved: appointments.filter(a => a.status === "approved").length,
  paid: appointments.filter(a => a.status === "paid").length,
  completed: appointments.filter(a => a.status === "completed").length, // same as paid
};

  const filteredAppointments =
    filter === "All"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  if (loading) return <h2 className="loading">Loading...</h2>;

  return (

  <div className="dashboard">

    {/* SIDEBAR FILTER */}
    <div className="sidebar">
      <h2 className="head">⚖️Appointment</h2>

      {["All", "pending", "approved", "paid","completed"].map((f) => (
        <div
          key={f}
          className={`menu-item ${filter === f ? "active" : ""}`}
          onClick={() => setFilter(f)}
        >
          {f}
        </div>
      ))}
    </div>

    {/* MAIN CONTENT */}
    <div className="main">

      {/* PROFILE FIRST */}
      {client && (
        <div className="profile-card">
        
            {client.profileImage ? (
      <img
        src={client.profileImage}
        alt="profile"
        className="profile2-img"
      />
    ) : (
      <div className="avatar3">
        {client.name?.charAt(0)}
      </div>
    )}

         <div className="profile-info">

  <h2>
    <FaUser className="icon" /> {client.name}
  </h2>

  <p>
    <FaEnvelope className="icon" /> {client.email}
  </p>

  <span>
    <FaPhone className="icon" /> {client.phone}
  </span>

  <span>
    <FaMapMarkerAlt className="icon" /> {client.address}
  </span>

</div>
<div className="profile-actions">
  <button
    className="edit-btn"
     onClick={() => navigate("/client/edit-profile")}>
    Edit Profile
  </button>

        </div>
        </div>
      )}
      <div className="stats-grid">

  {[
    { label: "Pending", key: "pending" },
    { label: "Approved", key: "approved" },
    { label: "Paid", key: "paid" },
    { label: "Completed", key: "completed" },
  ].map((item) => (
    <div
      key={item.key}
      className={`stat-card ${filter === item.key ? "active" : ""}`}
      onClick={() => {
        setFilter(item.key);
        setView("appointments"); // show appointments when clicked
      }}
    >
      <h3>{counts[item.key]}</h3>
      <p>{item.label}</p>
    </div>
  ))}

</div>

      {/* TITLE */}
      <h3 className="section-title">
        {filter} Appointments
      </h3>

      {/* APPOINTMENTS LIST */}
      <div className="appointments">

        {filteredAppointments.length === 0 ? (
          <p className="empty">No appointments found</p>
        ) : (
          filteredAppointments.map((app) => (
            <div key={app._id} className="appointment-card">

              <div className="left">
                <h4>{app.lawyerId?.name}</h4>
                <p>{app.lawyerId?.specialization}</p>

                <span>
                  {new Date(app.appointmentDate).toLocaleDateString()} | {app.timeSlot}
                </span>
              </div>

              <div className="right">

                <span className={`status ${app.status}`}>
                  {app.status}
                </span>

               {app.status === "pending" && (
  <>
   
    <button
      className="cancel-btn"
      onClick={() => handleCancel(app._id)}
    >
      Cancel
    </button>
  </>
)}

{app.status === "approved" && (
  <>
    <button
      className="pay-btn"
      onClick={() => {
        navigate(`/payment/${app._id}`);
        console.log("Navigate to payment for appointment:", app._id);
      }}
    >
      Pay Now
    </button>

    <button
      className="cancel-btn"
      onClick={() => handleCancel(app._id)}
    >
      Cancel
    </button>
  </>
)}

                {app.status === "paid" && (
           <button
  className="chat-btn"
  onClick={() => navigate(`/chat/${app._id}`,{
      state: {
        receiverId: app.lawyerId?._id,
        userId: client._id,
        receiverName: app.lawyerId?.name,
      },
    })
    }
>
  <span className="chat-icon">💬</span>
  <span>Chat Now</span>
</button>
                )}

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  </div>

  );
}

export default ClientDashboard;