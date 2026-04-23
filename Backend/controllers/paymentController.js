import Payment from "../models/Payment.js";
import Appointment from "../models/Appointment.js";
import { razorpay } from "../utils/razorpay.js";
import crypto from "crypto";


// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // 🔒 Validate amount
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // ✅ ensure integer paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);

  } catch (error) {
    console.error("Create Order Error:", error.message);
    return res.status(500).json({
      message: "Order creation failed",
      error: error.message, // ✅ useful for debugging
    });
  }
};


// ✅ VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body;

    // 🔒 Validate input
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID required" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    // 🔍 Step 1: Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // 🔍 Step 2: Get appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 🔍 Step 3: Prevent duplicate payment
    const existingPayment = await Payment.findOne({
      transactionId: razorpay_payment_id,
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already recorded",
      });
    }

    // ✅ Step 4: Save payment
    const payment = await Payment.create({
      appointment: appointmentId,
      client: appointment.clientId,
      lawyer: appointment.lawyerId,
      amount: appointment.amount || 500,
      paymentMethod: "Razorpay",
      paymentStatus: "Success",
      transactionId: razorpay_payment_id,
      paidAt: new Date(),
    });

    // ✅ Step 5: Update appointment
    appointment.status = "paid";
    appointment.paymentStatus = "Paid";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and appointment updated",
      payment,
    });

  } catch (error) {
    console.error("Verify Payment Error:", error.message);
    return res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};


// ✅ MARK AS PAID
export const markAsPaid = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "paid";
    appointment.paymentStatus = "Paid";

    await appointment.save();

    res.json({ message: "Marked as paid" });

    //email notification logic can be added here
    try { 
      await sendEmail({
        to: appointment.clientEmail,
        subject: "Payment Received",
        text: `Your payment for appointment ${appointmentId} has been received.`
      });
    } catch (emailError) {
      console.error("Email Error:", emailError.message);
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};