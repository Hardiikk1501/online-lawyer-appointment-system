import Lawyer from "../models/Lawyer.js";
import Appointment from "../models/Appointment.js";
import { sendEmail } from "../utils/sendEmail.js";



//get Lawyer Dashboard
 
export const getLawyerDashboard = async (req, res) => {

  try {

    const lawyerId = req.user.id;

    const totalRequests = await Appointment.countDocuments({
      lawyerId: lawyerId
    });

    const pendingRequests = await Appointment.countDocuments({
      lawyerId: lawyerId,
      status: "pending"
    });

    const approvedRequests = await Appointment.countDocuments({
      lawyerId: lawyerId,
      status: "approved"
    });

    const completedCases = await Appointment.countDocuments({
      lawyerId: lawyerId,
      status: "completed"
    });

   

   

    const appointments = await Appointment.find({
      lawyerId: lawyerId
    })
    .populate("clientId", "name email")
    .sort({ createdAt: -1 });

    res.json({
      stats: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        completedCases
      },
      appointments
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
// ✅ Get lawyer profile
  
 export const GetLawyerProfile = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get appointment requests which is send by client 
export const getAppointmentRequests = async (req, res) => { 
  try {

const appointments = await Appointment.find({
lawyerId: req.params.lawyerId
}).populate("clientId", "name email").sort({ createdAt: -1 });

res.json(appointments);
console.log("Client Email:", appointments[0]?.clientId?.email);
console.log("Lawyer Name:", appointments[0]?.lawyerId?.name);

} catch (error) {
res.status(500).json(error);
}

};

// // approve or reject appointment by lawyer

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ❗ Validate status
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const newStatus = status.toLowerCase();
    console.log("Incoming Status:", newStatus);

    // ✅ Update + populate
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { status: newStatus },
      { new: true }
    )
      .populate("clientId", "name email")
      .populate("lawyerId", "name");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // ✅ Debug logs
    console.log("Client Email:", appointment.clientId?.email);
    console.log("Client Name:", appointment.clientId?.name);
    console.log("Lawyer Name:", appointment.lawyerId?.name);

    // ❗ If no email → skip
    if (!appointment.clientId?.email) {
      console.log("❌ No client email found");
      return res.json(appointment);
    }

    let subject = "";
    let html = "";

    // =========================
    // ✅ APPROVED TEMPLATE
    // =========================
    if (newStatus === "approved") {
      subject = "Appointment Approved";

      html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
            <h2>Appointment Approved ✅</h2>
          </div>

          <div style="padding: 20px; color: #333;">
            <p>Hello <strong>${appointment.clientId.name}</strong>,</p>

            <p>Your appointment has been <strong style="color: green;">approved</strong>.</p>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Lawyer:</strong> ${appointment.lawyerId.name}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toDateString()}</p>
              <p><strong>Time:</strong> ${appointment.timeSlot}</p>
            </div>

            <p>Please make sure to be available on time.</p>

            <p style="margin-top: 20px;">Regards,<br><strong>Nyayasetu Team</strong></p>
          </div>

          <div style="background: #ecf0f1; padding: 10px; text-align: center; font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} Nyayasetu. All rights reserved.
          </div>

        </div>
      </div>
      `;
    }

    // =========================
    // ❌ REJECTED TEMPLATE
    // =========================
    else if (newStatus === "rejected") {
      subject = "Appointment Rejected";

      html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <div style="background: #e74c3c; color: white; padding: 20px; text-align: center;">
            <h2>Appointment Rejected ❌</h2>
          </div>

          <div style="padding: 20px; color: #333;">
            <p>Hello <strong>${appointment.clientId.name}</strong>,</p>

            <p>Your appointment request has been <strong style="color: red;">rejected</strong>.</p>

            <p><strong>Lawyer:</strong> ${appointment.lawyerId.name}</p>

            <p>You may try booking another appointment at a different time.</p>

            <p style="margin-top: 20px;">Regards,<br><strong>Nyayasetu Team</strong></p>
          </div>

          <div style="background: #ecf0f1; padding: 10px; text-align: center; font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} Nyayasetu. All rights reserved.
          </div>

        </div>
      </div>
      `;
    } else {
      console.log("⚠️ Invalid status:", newStatus);
    }

    // ✅ Send email
    if (subject && html) {
      try {
        await sendEmail(
          appointment.clientId.email,
          subject,
          html // ✅ HTML email
        );
        console.log(`✅ Email sent for status: ${newStatus}`);
      } catch (emailError) {
        console.log("❌ Email sending failed:", emailError.message);
      }
    }

    res.json(appointment);

  } catch (error) {
    console.log("❌ Controller Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

//get lawyerprofile for dashboard 
export const getProfile = async (req, res) => {
  try {

    console.log("USER:", req.user);

    const lawyer = await Lawyer.findById(req.user._id);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    res.status(200).json(lawyer);

  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
//update lawyer profile

export const updateProfile = async (req, res) => {
  
  const lawyer = await Lawyer.findById(req.user._id);

  if (!lawyer) {
    return res.status(404).json({ message: "Lawyer not found" });
  }

  lawyer.name = req.body.name || lawyer.name;
  lawyer.profileImage = req.body.profileImage || lawyer.profileImage;
   lawyer.consultationFee = req.body.consultationFee || lawyer.consultationFee;
   lawyer.bio = req.body.bio || lawyer.bio;
   lawyer.address = req.body.address || lawyer.address; 
   lawyer.phone = req.body.phone || lawyer.phone; 
   lawyer.licenseNumber = req.body.licenseNumber || lawyer.licenseNumber; 
   lawyer.experience = req.body.experience || lawyer.experience;
  lawyer.specialization = req.body.specialization || lawyer.specialization;

  await lawyer.save();

  res.json({ message: "Profile updated" });
};

