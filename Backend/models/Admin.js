import mongoose from 'mongoose';


const AdminSchema = new mongoose.Schema(
     {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  "Please provide a valid email address",
],


    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // ❗ hide password in queries
    },

    role: {
      type: String,
      default: "Admin",
      enum: ["Admin"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
     otp: String,
     otpExpire: Date,
  },
  {
    timestamps: true,
  });

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;