import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import "../../assets/STYLES/Report.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Report() {

  const [filter, setFilter] = useState("weekly");
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, [filter]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5050/api/admin/report?filter=${filter}`
      );
      

      console.log("API DATA:", res.data);

      setStats(res.data.stats || {});
      setChartData(res.data.chart || { labels: [], data: [] });

    } catch (err) {
      console.error(err);
      setError("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  // 📊 Chart
  const bookingChart = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Bookings",
        data: chartData.data,
        backgroundColor: "rgba(143, 166, 13, 0.67)"
      }
    ]
  };

  // 📥 EXPORT
  const exportCSV = () => {
    window.open("http://localhost:5050/api/admin/export/csv");
  };

  const exportPDF = () => {
    window.open("http://localhost:5050/api/admin/export/pdf");
  };

  return (
    <div className="report-container">

      <h2>Appointment Reports</h2>

      {/* 📅 FILTER */}
      <div className="filters">
        <button onClick={() => setFilter("today")}>Today</button>
        <button onClick={() => setFilter("weekly")}>Weekly</button>
        <button onClick={() => setFilter("monthly")}>Monthly</button>
      </div>

      {/* ⏳ LOADING */}
      {loading && <p>Loading...</p>}

      {/* ❌ ERROR */}
      {error && <p className="error">{error}</p>}

      {/* 💰 STATS + CHART */}
      {!loading && !error && (
        <>
          <div className="stats-grid">
            <div className="card">
             
              <p>Total Appointments</p>
               <h3>{stats.totalAppointments || 0}</h3>
            </div>
          </div>

          <div className="chart-box">
            <h3>Bookings</h3>
            <Bar data={bookingChart} />
          </div>
        </>
      )}

      {/* 📥 EXPORT */}
      <div className="export-btns">
        <button onClick={exportCSV}>Download Excel</button>
        <button onClick={exportPDF}>Download PDF</button>
      </div>

    </div>
  );
}

export default Report;