import Lawyer from "../models/Lawyer.js";
import Client from "../models/Client.js";
import Appointment from "../models/Appointment.js";
import PDFDocument from "pdfkit";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";


//getDashaboardStats

export const getDashboardStats = async (req, res) => {

  try {
    const lawyersCount = await Lawyer.countDocuments();
    const clientsCount = await Client.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    const revenue = await Appointment.aggregate([
      { $match: { status: "completed", paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res.json({
      lawyers: lawyersCount,
      clients: clientsCount,
      appointments: appointmentsCount,
      revenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  } 
}


//getAllClients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//deleteClient
export const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//getAllLawyers
export const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find();
    res.status(200).json(lawyers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//deleteLawyer
export const deleteLawyer = async (req, res) => {
  const { id } = req.params;
  try {
    await Lawyer.findByIdAndDelete(id);
    res.status(200).json({ message: "Lawyer deleted successfully" });
  }
    catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//getAllAppointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("clientId", "name email")
      .populate("lawyerId", "name email")
      .sort({ createdAt: -1 })
      .lean(); // ✅ better performance

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {
    console.error("Appointment Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//deleteAppointment
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// 📊 REPORT API
export const getAdminReport = async (req, res) => {
  try {
    const { filter = "weekly" } = req.query;

    let days = 7;
    if (filter === "today") days = 1;
    if (filter === "monthly") days = 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const appointments = await Appointment.find({
      createdAt: { $gte: startDate }
    });

    // 📊 GROUP BY DATE (optimized)
    const dateMap = {};

    appointments.forEach((a) => {
      const date = new Date(a.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD

      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    // 🔄 SORT DATA
    const sortedDates = Object.keys(dateMap).sort();

    const chart = {
      labels: sortedDates,
      data: sortedDates.map(date => dateMap[date])
    };

    res.json({
      stats: {
        totalAppointments: appointments.length
      },
      chart
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📥 PROFESSIONAL CSV EXPORT
export const exportCSV = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("clientId", "name")
      .populate("lawyerId", "name");

    let csv = "";

    // 🔹 TITLE ROW
    csv += "Admin Report\n";
    csv += `Generated On:,${new Date().toLocaleString()}\n\n`;

    // 🔹 HEADER
    csv += "No,Client Name,Lawyer Name,Date,Time,Status\n";

    // 🔹 DATA
    appointments.forEach((a, index) => {
      csv += `${index + 1},${a.clientId?.name || "-"},${a.lawyerId?.name || "-"},${new Date(a.appointmentDate).toLocaleDateString()},${a.timeSlot || "-"},${a.status || "-"}\n`;
    });

    // 🔹 SUMMARY
    csv += `\nTotal Appointments:,${appointments.length}\n`;

    res.header("Content-Type", "text/csv");
    res.attachment("admin-report.csv");
    res.send(csv);

  } catch (err) {
    console.error("CSV ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// 📄 ADVANCED PDF EXPORT
export const exportPDF = async (req, res) => {
  try {
    const { filter = "weekly" } = req.query;

    const appointments = await Appointment.find()
      .populate("clientId", "name")
      .populate("lawyerId", "name");

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=admin-report.pdf"
    );

    doc.pipe(res);

    // ================= LOGO =================
    try {
      doc.image("public/logo1.png", 40, 20, { width: 50 });
    } catch (e) {}

    // ================= HEADER =================
    doc
      .fontSize(20)
      .fillColor("#1b087c")
      .text("Appointment Report", 100, 30);

    doc
      .fontSize(10)
      .fillColor("#444")
      .text(`Generated: ${new Date().toLocaleString()}`, 100, 55);

    doc
      .fontSize(10)
      .text(`Duration: ${filter.toUpperCase()}`, 100, 70);

    doc.moveDown(2);

    // ================= CHART =================
    const chartCanvas = new ChartJSNodeCanvas({
      width: 500,
      height: 150 // 🔥 REDUCED HEIGHT
    });

    const dateMap = {};
    appointments.forEach(a => {
      const date = new Date(a.createdAt).toISOString().split("T")[0];
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    const labels = Object.keys(dateMap).sort();
    const data = labels.map(d => dateMap[d]);

    const chartImage = await chartCanvas.renderToBuffer({
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Bookings",
            data,
            backgroundColor: "rgba(18,129,144,0.6)"
          }
        ]
      }
    });

    doc.image(chartImage, {
      align: "center",
      width: 500
    });

    // ✅ DYNAMIC Y POSITION
    let y = doc.y + 20;

    // ================= TABLE =================
    const rowHeight = 22;
    const colX = [50, 90, 180, 290, 370, 450];
    const headers = ["No", "Client", "Lawyer", "Date", "Time", "Status"];

    // Header
    doc.rect(50, y, 500, rowHeight).fill("#4f46e5");

    headers.forEach((h, i) => {
      doc
        .fillColor("#fff")
        .fontSize(10)
        .text(h, colX[i] + 5, y + 6);
    });

    y += rowHeight;

    // Rows
    appointments.forEach((a, index) => {

      // 🔥 FIXED PAGE BREAK CONDITION
      if (y + rowHeight > doc.page.height - 60) {
        doc.addPage();
        y = 50;

        doc.rect(50, y, 500, rowHeight).fill("#4f46e5");
        headers.forEach((h, i) => {
          doc
            .fillColor("#fff")
            .fontSize(10)
            .text(h, colX[i] + 5, y + 6);
        });

        y += rowHeight;
      }

      if (index % 2 === 0) {
        doc.rect(50, y, 500, rowHeight).fill("#f3f4f6");
      }

      let statusColor = "#000";
      if (a.status === "paid") statusColor = "green";
      else if (a.status === "pending") statusColor = "orange";
      else if (a.status === "completed") statusColor = "blue";

      const row = [
        index + 1,
        a.clientId?.name || "-",
        a.lawyerId?.name || "-",
        new Date(a.appointmentDate).toLocaleDateString(),
        a.timeSlot,
        a.status
      ];

      row.forEach((text, i) => {
        doc
          .fillColor(i === 5 ? statusColor : "#111")
          .fontSize(9)
          .text(text, colX[i] + 5, y + 6);
      });

      y += rowHeight;
    });

    // ================= FOOTER =================
    // doc
    //   .fontSize(9)
    //   .fillColor("#999")
    //   .text(
    //     "Generated by Nyayasetu System",
    //     50,
    //     doc.page.height - 40,
    //     { align: "center" }
    //   );

    doc.end();

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


//get pending lawyers
export const getPendingLawyers = async (req, res) => {
  const lawyers = await Lawyer.find({ status: "pending" });
  res.json(lawyers);
};

//approve lawyer
export const approveLawyer = async (req, res) => {
  const { id } = req.params;

  await Lawyer.findByIdAndUpdate(id, { status: "approved" });

  res.json({ message: "Lawyer approved successfully" });
};

//reject lawyer
export const rejectLawyer = async (req, res) => {
  const { id } = req.params;
  await Lawyer.findByIdAndUpdate(id, { status: "rejected" });
  res.json({ message: "Lawyer rejected successfully" });
};
