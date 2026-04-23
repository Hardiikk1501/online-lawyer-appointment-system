import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
    {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lawyer",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
      example: "10:00 AM - 10:30 AM",
    },

    caseType: {
      type: String,
    },

    description: {
      type: String,
      trim: true,
    },
     amount: {
      type: Number,
      default:500,
    
      
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "locked","confirmed","paid"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
   lockExpiresAt: {
  type: Date,
   default: null,
},
  paymentId: {
    type: String,
  },

    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,

    }
);

// prevent duplicate slots  creating indexes
 
AppointmentSchema.index(
  { lawyerId: 1, appointmentDate: 1, timeSlot: 1 },
  { unique: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);   
export default Appointment;
