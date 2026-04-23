import Lawyer from "../models/Lawyer.js";
import Client from "../models/Client.js";
import Appointment from "../models/Appointment.js";
import { sendEmail } from "../utils/sendEmail.js";



//get client profile
export const getClientProfile = async (req, res) => {

  try {

    const client = await Client.findById(req.user._id).select("-password");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message
    });

  }

};

//getAllAppointments
export const getClientAppointments = async (req, res) => {

  try {

    const appointments = await Appointment.find({
      clientId: req.user._id
    })
      .populate("lawyerId", "name email specialization")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message
    });

  }

};

//send appointment request to lawyer
 export const sendAppointmentRequest = async (req, res) => {
  try {
    const { lawyerId, appointmentDate, timeSlot, description } = req.body;
    const clientId = req.user._id;

    // Validate required fields
    if (!lawyerId || !appointmentDate || !timeSlot || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check lawyer
    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }
    console.log("LAWYER FEE 👉", lawyer.consultationFee); // 🔍 debug

    // Check client
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    const existing = await Appointment.findOne({
  lawyerId,
  appointmentDate,
  timeSlot,
  amount: lawyer.consultationFee,
  clientId,
 
});

if(existing){
  return res.status(400).json({
    message:"Appointment already exists"
  });
}

    // Create appointment
    const appointment = await Appointment.create({
      clientId,
      lawyerId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      amount: lawyer.consultationFee,
      description,
      
    });

    // Send Email to Lawyer
    try {
      console.log("Sending email to:", lawyer.email);
await sendEmail(
  lawyer.email,
  "New Appointment Request",
  `
  <div style="font-family: Arial, sans-serif; padding:20px;">
    
    <h2 style="color:#2c3e50;">📅 New Appointment Request</h2>

    <p>👤 <strong>Client:</strong> ${client.name}</p>

    <p>📆 <strong>Date:</strong> ${appointment.appointmentDate.toDateString()}</p>

    <p>⏰ <strong>Time:</strong> ${appointment.timeSlot}</p>

    <p>📝 <strong>Description:</strong></p>
    <p style="background:#f4f4f4;padding:10px;border-radius:6px;">
      ${description}
    </p>

    <p>🔔 Please login to your dashboard to review the request.</p>

    <a href="http://localhost:5173/client"
       style="display:inline-block;
              padding:10px 20px;
              background:#3498db;
              color:white;
              text-decoration:none;
              border-radius:5px;
              margin-top:10px;">
       View Appointment
    </a>

  </div>
  `
);
    } catch (emailError) {
      console.error("Email Error:", emailError.message);
    }

    res.status(201).json({
      message: "Appointment request sent successfully",
      appointment
    });

  } catch (error) {
    console.error("Appointment Error:", error);

    res.status(500).json({
      message: "Error sending appointment request",
      error: error.message
    });
  }
};

//getLawyersBySpecialization
export const getLawyers = async (req, res) => {
  const { specialization } = req.query;
  try {
     let filter = {};
   if (specialization) {
      filter.specialization = specialization;
    }

    const lawyers = await Lawyer.find(filter);

    res.status(200).json(lawyers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//delete appointment 
export const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}; 
//update client profile
export const updateClientProfile = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const client = await Client.findById(req.user._id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.name = name || client.name;
    client.email = email || client.email;
    client.phone = phone || client.phone;
      client.address = address || client.address;

    await client.save();

    res.status(200).json({ message: "Profile updated successfully", client });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};