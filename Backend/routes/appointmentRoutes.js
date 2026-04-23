import express from "express";

import {
  lockSlot,
  confirmBooking,
  getBookedSlots,
  completeAppointment,
  getAppointmentById
} from "../controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const appointmentRouter = express.Router();

// lock slot (5 min)
appointmentRouter.post("/lock-slot", protect, lockSlot);

// confirm booking after payment
appointmentRouter.post("/confirm", protect, confirmBooking);

// get booked + locked slots
appointmentRouter.get("/booked/:lawyerId", protect, getBookedSlots);

// complete appointment (lawyer side)
appointmentRouter.put("/complete/:appointmentId", protect, completeAppointment);

// get appointment details (for payment page)
appointmentRouter.get("/:id", protect, getAppointmentById);  


export default appointmentRouter;