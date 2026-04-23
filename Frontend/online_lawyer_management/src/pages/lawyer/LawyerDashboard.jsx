
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaTachometerAlt,
  FaUser,
  FaCalendarCheck,
  FaSignOutAlt
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";

import "../../assets/STYLES/LawyerDashboard.css";


function LawyerDashboard() {

  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard"); // ⭐ NEW

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [profile, setProfile] = useState({});
const [editMode, setEditMode] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    completedCases: 0,
    revenue: 0
  });

  const token = localStorage.getItem("token");
  const API = `${import.meta.env.VITE_API_URL}/api/lawyer`;

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, appointments]);

  // FETCH
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppointments(res.data.appointments || []);
      setStats(res.data.stats || {});
    } catch (err) {
      Swal.fire("Error", "Failed to load dashboard", "error");
    }
  };
  const [preview, setPreview] = useState(null);
  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    setProfile({ ...profile, image: file });

    // preview (no refresh issue)
    setPreview(URL.createObjectURL(file));
  }
};


  // FILTER
  const applyFilter = () => {
    if (filter === "all") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter(
          (a) => a.status?.toLowerCase() === filter
        )
      );
    }
  };
  //fetch profile
 const fetchProfile = async () => {
  try {
    const res = await axios.get(`${API}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setProfile(res.data);

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load profile", "error");
  }
};
useEffect(() => {
  if (activePage === "profile") {
    fetchProfile();
  }
}, [activePage]);

const handleChange = (e) => {
  const { name, value } = e.target;

  setProfile((prev) => ({
    ...prev,
    [name]: value
  }));
};

// UPDATE PROFILE
const updateProfile = async () => {
  try {

    await axios.put(
      `${API}/profile`,
      profile,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    Swal.fire("Success", "Profile updated", "success");

    setEditMode(false);

    // ✅ refresh profile after update
    fetchProfile();

  } catch (err) {
    console.error(err);
    Swal.fire(
      "Error",
      err.response?.data?.message || "Update failed",
      "error"
    );
  }
};


  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", `Appointment ${status}`, "success");
      fetchDashboard();
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };
  const chartData = {
  labels: ["Total", "Pending", "Approved", "Completed"],
  datasets: [
    {
      label: "Appointments",
      data: [
        stats.totalRequests || 0,
        stats.pendingRequests || 0,
        stats.approvedRequests || 0,
        stats.completedCases || 0,
      
      ],
      backgroundColor: [
        "#3b82f6",
        "#f59e0b",
        "#10b981",
        "#6366f1"
      ],
      hoverBackgroundColor: [
        "#2563eb",
        "#d97706",
        "#059669",
        "#4f46e5"
      ],
      borderRadius: 8
    }
  ]
};

  const chartOptions = {
  responsive: true,
  animation: {
    duration: 1200,          // smooth animation
    easing: "easeOutQuart"   // premium feel
  },
  plugins: {
    legend: {
      display: true,
      position: "top"
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#1e293b",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 10
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

  return (
    <div className="lawyer-page">
      <div className="dashboard-container">

        {/* ===== SIDEBAR ===== */}
        <aside className="sidebar1">
          
          <div className="sidebar1-profile1">
            <div className="photo">
  {profile.profileImage ? (
    <img
      src={profile.profileImage}
      alt="profile"
      className="profile5-img"
    />
  ) : (
    <div className="avatar5">
      {profile.name?.charAt(0)}
    </div>
  )}
  </div>
  
 <div className="info">
  <h4>{profile.name || "Lawyer"}</h4>
  <p>{profile.specialization || "Specialist"}</p>
  </div>
</div>

          
          <div className="sidebar1-logo">Lawyer Panel</div>

          <ul>
            <li
              className={activePage === "dashboard" ? "active" : ""}
              onClick={() => setActivePage("dashboard")}
            >
              <FaTachometerAlt /> Dashboard
            </li>

            <li
              className={activePage === "appointments" ? "active" : ""}
              onClick={() => setActivePage("appointments")}
            >
              <FaCalendarCheck /> Appointments
            </li>

            <li
              className={activePage === "profile" ? "active" : ""}
              onClick={() => setActivePage("profile")}
            >
              <FaUser /> My Profile
            </li>

            <li
              className="logout"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        </aside>

        {/* ===== MAIN ===== */}
        <main className="lawyer-dashboard">

          {/* ===== DASHBOARD ===== */}
          {activePage === "dashboard" && (
            <>
              <h2>Dashboard</h2>

              <div className="dashboard-cards">
                <div className="card total">Total: {stats.totalRequests}</div>
                <div className="card pending">Pending: {stats.pendingRequests}</div>
                <div className="card approved">Approved: {stats.approvedRequests}</div>
                <div className="card completed">Completed: {stats.completedCases}</div>
                {/* <div className="card revenue">₹ {stats.revenue}</div> */}
              </div>

              {/* 🔥 Add Chart Later */}
              <div className="chart-box">
                📊  Appointment Chart...
                <Bar data={chartData}
                  options={chartOptions}
                  
                />

              </div>
            </>
          )}

          {/* ===== APPOINTMENTS ===== */}
          {activePage === "appointments" && (
            <>
              <h2>Appointments</h2>

              {/* FILTER */}
              <div className="filter-box">
                <select onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="paid">Paid</option>
                  
                  
                </select>
              </div>

              <div className="table-container">
                <table className="appointment-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map((app) => (
                      <tr key={app._id}>
                        <td>{app.clientId?.name}</td>
                        <td>{app.clientId?.email}</td>
                        <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                        <td>{app.timeSlot}</td>

                        <td>
                          <span className={`status ${app.status}`}>
                            {app.status}
                          </span>
                        </td>

<td>

  {/* 🟡 PENDING → Approve + Reject */}
  {app.status?.toLowerCase() === "pending" && (
    <>
      <button
        className="approve-btn"
        onClick={() => updateStatus(app._id, "approved")}
      >
        Approve
      </button>

      <button
        className="reject-btn"
        onClick={() => updateStatus(app._id, "rejected")}
      >
        Reject
      </button>
    </>
  )}

  {/* 🔵 APPROVED (NOT PAID) → Cancel */}
  {app.status?.toLowerCase() === "approved" &&
    app.paymentStatus !== "Paid" && (
      <button
        className="reject-btn"
        onClick={() => updateStatus(app._id, "cancelled")}
      >
        Cancel
      </button>
    )}

  {/* 🟢 PAID → Chat + Complete */}
  {app.paymentStatus === "Paid" && (
    <>
      <button
        className="chat-btn"
         disabled={app.status === "completed"}   // ✅ disable condition
        onClick={() =>
          navigate(`/chat/${app._id}`, {
            state: {
              receiverId: app.clientId?._id,
              userId: app.lawyerId,
              receiverName: app.clientId?.name,
            },
          })
        }
      >
        💬 Chat
      </button>

      {app.status !== "completed" && (
        <button
          className="complete-btn"
          onClick={() => updateStatus(app._id, "completed")}
        >
          ✔ Complete
        </button>
      )}
    </>
  )}

</td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ===== PROFILE ===== */}
         {activePage === "profile" && (
  <>
    <h2>My Profile</h2>

    <div className="profile1-card">

       {/* PROFILE IMAGE */}
  <div className="form-group">
    <label>Profile Image</label>

    {/* Preview */}
    <img
      src={preview || profile.image || "/default-avatar.png"}
      alt="profile"
      className="profile6-img"
    />

    <input
      type="file"
      name="image"
      accept="image/*"
      onChange={handleImageChange}   // ✅ separate handler
      disabled={!editMode}
    />
  </div>

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={profile.name || ""}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={profile.email || ""}
          onChange={handleChange}
          disabled
        />
      </div>

      <div className="form-group">
        <label>consultationFee</label>
        <input
          type="number"
          name="consultationFee"
          value={profile.consultationFee || ""}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      
      <div className="form-group">
        <label>Experience</label>
        <input
          type="number"
          name="experience"
          value={profile.experience || ""}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>
      
      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"          name="phone"
          value={profile.phone || ""}
          onChange={handleChange}       disabled={!editMode}
        />
      </div>    
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={profile.address || ""}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

       

      {/* Buttons */}
      {!editMode ? (
        <button
          className="edit-btn"
          onClick={() => setEditMode(true)}
        >
          Edit Profile
        </button>
      ) : (
        <>
          <button className="save-btn" onClick={updateProfile}>
            Save
          </button>

          <button
            className="cancel-btn"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </>
      )}

    </div>
  </>
)}

        </main>
      </div>
    </div>
  );
}

export default LawyerDashboard;