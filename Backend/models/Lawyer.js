import mongoose from 'mongoose';


const LawyerSchema = new mongoose.Schema(
   {
    name: {
      type: String,
      required: [true, "Lawyer name is required"],
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
profileImage: {
      type: String,
    default:""
    },


    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      maxlength: 10,
    },
    address: {
        type: String,
        required:true
    },

    role: {
      type: String,
      default: "Lawyer",
      enum: ["Lawyer"],
    },

    specialization: {
      type: String,
      required: true,
      enum: [
        "Criminal",
        "Civil",
        "Family",
        "Corporate",
        "Property",
        "Cyber",
        "Other",
      ],
    },

    experience: {
      type: Number, // years
      required: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },


    availability: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin approval
    },
    otp: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },isVerified: { type: Boolean, default: false },

    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["pending", "Approved", "Rejected"],
      default: "pending",
    },
  },
 
  {
    timestamps: true,
  
  }
);


 const Lawyer = mongoose.model("Lawyer", LawyerSchema);
export default Lawyer;
