import mongoose from "mongoose";


const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },

    email: {
      type: String,
     match: [
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  "Please provide a valid email address",
],
      
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
profileImage: {
      type: String,
    default:""
    },

    phone: {
      type: String,
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
      required: true,
      maxlength: 10,
    },

    address: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "Client",
      enum: ["Client"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", ClientSchema);

export default Client;
