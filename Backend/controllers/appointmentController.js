
import Appointment from "../models/Appointment.js";
import { sendEmail } from "../utils/sendEmail.js";
import Lawyer from "../models/Lawyer.js";


// =================================
// LOCK SLOT (5 minutes)
// =================================
export const lockSlot = async (req, res) => {

  try {
    
    const { lawyerId, date, timeSlot } = req.body;
    const clientId = req.user._id;

    if (!lawyerId || !date || !timeSlot) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const selectedDate = new Date(date);

    const start = new Date(selectedDate.setHours(0,0,0,0));
    const end = new Date(selectedDate.setHours(23,59,59,999));

    // check booked
    const booked = await Appointment.findOne({
      lawyer: lawyerId,
      appointmentDate: { $gte:start, $lte:end },
      timeSlot,
      status: { $in:["pending","approved","paid"] }
    });

    if (booked) {
      return res.status(400).json({ message:"Slot already booked" });
    }

    // check locked
    const locked = await Appointment.findOne({
      lawyer: lawyerId,
      appointmentDate: { $gte:start, $lte:end },
      timeSlot,
      status:"locked",
      lockExpiresAt:{ $gt:new Date() }
    });

    if (locked) {
      return res.status(400).json({ message:"Slot temporarily locked" });
    }

    const lockTime = new Date(Date.now() + 5 * 60 * 1000);

    const appointment = await Appointment.create({

  clientId: clientId,
  lawyerId: lawyerId,
  appointmentDate: selectedDate,
  timeSlot: timeSlot,
  status: "locked",
  amount: Lawyer.consultationFee, // set your consultation fee here
  lockExpiresAt: lockTime

});


    res.status(200).json({
      success:true,
      message:"Slot locked",
      appointment
    });
   

  } catch (error) {

    console.log("LOCK SLOT ERROR:", error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



// =================================
// CONFIRM BOOKING (after payment)
// =================================
export const confirmBooking = async (req, res) => {

  try {

    const { appointmentId } = req.body;

    const appointment = await Appointment
      .findById(appointmentId)
      .populate("lawyer")
      .populate("client");

    if (!appointment) {
      return res.status(404).json({
        success:false,
        message:"Appointment not found"
      });
    }

    if (appointment.status !== "locked") {
      return res.status(400).json({
        success:false,
        message:"Slot lock expired"
      });
    }

    appointment.status = "pending";
    appointment.paymentStatus = "paid";
    appointment.lockExpiresAt = null;

    await appointment.save();


    // Email to lawyer
    await sendEmail(
      appointment.lawyer.email,
      "New Appointment Request",
      `You received a new appointment request from ${appointment.clientId.name}.
      
Date: ${appointment.appointmentDate.toDateString()}
Time: ${appointment.timeSlot}`
    );


    // Email to client
    await sendEmail(
      appointment.client.email,
      "Appointment Confirmed",
      `Your appointment request has been sent successfully.
      
Lawyer: ${appointment.lawyerId.name}
Date: ${appointment.appointmentDate.toDateString()}
Time: ${appointment.timeSlot}`
    );


    res.json({
      success:true,
      message:"Appointment confirmed"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



// =================================
// GET BOOKED + LOCKED SLOTS
// =================================
export const getBookedSlots = async (req, res) => {

  try {

    const { lawyerId } = req.params;
    const { date } = req.query;

    if (!lawyerId || !date) {
      return res.status(400).json({
        message:"LawyerId and date required"
      });
    }

    const selectedDate = new Date(date);

    const start = new Date(selectedDate.setHours(0,0,0,0));
    const end = new Date(selectedDate.setHours(23,59,59,999));


    // BOOKED
    const bookedAppointments = await Appointment.find({

      lawyer: lawyerId,
      appointmentDate: { $gte:start, $lte:end },
      status: { $in:["pending","approved","paid"] }

    }).select("timeSlot");

    const booked = bookedAppointments.map(a => a.timeSlot);


    // LOCKED
    const lockedAppointments = await Appointment.find({

      lawyer: lawyerId,
      appointmentDate: { $gte:start, $lte:end },
      status:"locked",
      lockExpiresAt: { $gt:new Date() }

    }).select("timeSlot");

    const locked = lockedAppointments.map(a => a.timeSlot);


    res.json({
      booked,
      locked
    });

  } catch (error) {

    res.status(500).json({
      message:error.message
    });

  }

};



// =================================
// COMPLETE APPOINTMENT
// =================================
export const completeAppointment = async (req,res)=>{

  try{

    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if(!appointment){
      return res.status(404).json({
        success:false,
        message:"Appointment not found"
      });
    }

    appointment.status = "completed";

    await appointment.save();

    res.json({
      success:true,
      message:"Appointment completed"
    });

  }
  catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

// =================================
//get appointment details (for payment page)
// =================================

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Validate ID
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    // 🔍 Find appointment + populate lawyer details
    const appointment = await Appointment.findById(id)
      .populate("lawyerId", "name email") // adjust fields if needed
      .populate("clientId", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ✅ Success response
    res.status(200).json(appointment);

  } catch (error) {
    console.error("Get Appointment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

