import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
    },
    isRead :{
      type:Boolean,
      default:false
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);