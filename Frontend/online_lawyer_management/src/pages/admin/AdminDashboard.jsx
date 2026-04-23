

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Calendar,
  FileText,
  Trash2,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import "../../assets/STYLES/AdminDashboard.css";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    lawyers: 0,
    appointments: 0,
  });

  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeType, setActiveType] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.log("Dashboard Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      setDataLoading(true);
      setActiveType("clients");

      const res = await API.get("/admin/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (error) {
      console.log("Error fetching clients:", error.message);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchLawyers = async () => {
    try {
      setDataLoading(true);
      setActiveType("lawyers");

      const res = await API.get("/admin/lawyers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (error) {
      console.log("Error fetching lawyers:", error.message);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setDataLoading(true);

      const res = await API.get("/admin/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data.appointments);
      setActiveType("appointments");

    } catch (error) {
      Swal.fire("Error", "Failed to load appointments", "error");
      setAppointments([]);
    } finally {
      setDataLoading(false);
    }
  };

  // 🔥 NEW: APPROVE LAWYER
  const approveLawyer = async (id) => {
    try {
      await API.post(`/admin/lawyers/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: "approved" } : u
        )
      );

      Swal.fire("Approved!", "Lawyer approved successfully.", "success");
    } catch {
      Swal.fire("Error!", "Approval failed.", "error");
    }
  };

  // 🔥 NEW: REJECT LAWYER
  const rejectLawyer = async (id) => {
    try {
      await API.post(`/admin/lawyers/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: "rejected" } : u
        )
      );

      Swal.fire("Rejected!", "Lawyer rejected.", "info");
    } catch {
      Swal.fire("Error!", "Rejection failed.", "error");
    }
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/admin/${activeType}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((user) => user._id !== id));

      setStats((prev) => ({
        ...prev,
        [activeType]: Math.max(0, prev[activeType] - 1),
      }));

      Swal.fire("Deleted!", "User removed successfully.", "success");
    } catch {
      Swal.fire("Error!", "Delete failed.", "error");
    }
  };

  const deleteAppointment = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This appointment will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/admin/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments((prev) =>
        prev.filter((appt) => appt._id !== id)
      );

      setStats((prev) => ({
        ...prev,
        appointments: Math.max(0, prev.appointments - 1),
      }));

      Swal.fire("Deleted!", "Appointment removed successfully.", "success");
    } catch {
      Swal.fire("Error!", "Delete failed.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading Dashboard...</h2>;

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={!activeType ? "active" : ""} onClick={() => setActiveType("")}>
              <LayoutDashboard size={20} /> <span>Dashboard</span>
            </li>

            <li className={activeType === "clients" ? "active" : ""} onClick={fetchClients}>
              <Users size={20} /> <span>Manage Clients</span>
            </li>

            <li className={activeType === "lawyers" ? "active" : ""} onClick={fetchLawyers}>
              <Briefcase size={20} /> <span>Manage Lawyers</span>
            </li>

            <li className={activeType === "appointments" ? "active" : ""} onClick={fetchAppointments}>
              <Calendar size={20} /> <span>Appointments</span>
            </li>

            <li onClick={() => navigate("/admin/reports")}>
              <FileText size={20} /> <span>Reports</span>
            </li>

            <li className="logout-item" onClick={handleLogout}>
              <LogOut size={20} /> <span>Logout</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="admin-main-content">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        <div className="stats-grid">
          <div className="stat-card blue" onClick={fetchClients}>
            <Users />
            <h3>{stats.clients}</h3>
            <p>Total Clients</p>
          </div>

          <div className="stat-card green" onClick={fetchLawyers}>
            <Briefcase />
            <h3>{stats.lawyers}</h3>
            <p>Total Lawyers</p>
          </div>

          <div className="stat-card orange" onClick={fetchAppointments}>
            <Calendar />
            <h3>{stats.appointments}</h3>
            <p>Appointments</p>
          </div>

          <div className="stat-card purple" onClick={() => navigate("/admin/reports")}>
            <FileText />
            <h3>View</h3>
            <p>Reports</p>
          </div>
        </div>

        {activeType && (
          <div className="admin-list">
            <h2>
              {activeType === "clients" && "All Clients"}
              {activeType === "lawyers" && "All Lawyers"}
              {activeType === "appointments" && "All Appointments"}
            </h2>

            {dataLoading ? (
              <h3>Loading...</h3>
            ) : (
              <table>
                <thead>
                  <tr>
                    {(activeType === "clients" || activeType === "lawyers") && (
                      <>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Registered Date</th>
                        {activeType === "lawyers" && <th>Status</th>}
                        <th>Action</th>
                      </>
                    )}

                    {activeType === "appointments" && (
                      <>
                        <th>Client</th>
                        <th>Lawyer</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {(activeType === "clients" || activeType === "lawyers") &&
                    (users.length === 0 ? (
                      <tr><td colSpan="5">No Data Found</td></tr>
                    ) : (
                      users.map((item) => (
                        <tr key={item._id}>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                          {activeType === "lawyers" && (
                            <td>
                              <span className={`status-badge ${item.status}`}>
                                {item.status}
                              </span>
                            </td>
                          )}

                          <td>
                            {activeType === "lawyers" ? (
                              <>
                                {item.status === "pending" && (
                                  <>
                                    <button className="approve-btn" onClick={() => approveLawyer(item._id)}>Approve</button>
                                    <button className="reject-btn" onClick={() => rejectLawyer(item._id)}>Reject</button>
                                  </>
                                )}

                                {item.status !== "pending" && (
                                  <button className="delete-btn" onClick={() => deleteUser(item._id)}>
                                    <Trash2 size={16} /> Delete
                                  </button>
                                )}
                              </>
                            ) : (
                              <button className="delete-btn" onClick={() => deleteUser(item._id)}>
                                <Trash2 size={16} /> Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ))}

                  {activeType === "appointments" &&
                    (appointments.length === 0 ? (
                      <tr><td colSpan="5">No Appointments Found</td></tr>
                    ) : (
                      appointments.map((item) => (
                        <tr key={item._id}>
                          <td>{item.clientId ? item.clientId.name : "❌ Client Deleted"}</td>
                          <td>{item.lawyerId ? item.lawyerId.name : "❌ Lawyer Deleted"}</td>
                          <td>{new Date(item.appointmentDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${item.status?.toLowerCase() || ""}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <button className="delete-btn" onClick={() => deleteAppointment(item._id)}>
                              <Trash2 size={16} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;