
import Admin from '../models/Admin.js';
import Lawyer from '../models/Lawyer.js';
import Client from '../models/Client.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/sendEmail.js";
import cloudinary from "../config/cloudinary.js";


// 📝 Register Client
export const registerClient = async (req, res) => {
  try {
    const { name, email, password, phone, address, profileImage } = req.body;


    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Email already in use" });
    }
     
     const hashedPassword = await bcrypt.hash(password, 10);
     let  imageUrl = "";
      
       if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
       // folder: "lawyers", // optional folder
      });

      imageUrl = result.secure_url;
    }

    const client = await Client.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      profileImage: imageUrl,
       
    });

    res.status(201).json({
      message: "Client registered successfully",
      clientId: client._id.toString(),
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

 //login client

export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email }).select("+password");
    if (!client) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  // Generate JWT with user ID and role
    const token = jwt.sign(
      {
        id: client._id,
        role: "client",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ SEND USER OBJECT (without password)
    res.status(200).json({
      
      token,
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        role: "client",
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//logout client
export const logoutClient = (req, res) => {
  res.json({ message: 'Logout successful' });
};


// Register Lawyer
// export const registerLawyer = async (req, res) => {
//   const { name, email, password, phone, address , specialization, experience, licenseNumber, consultationFee , profileImage , bio} = req.body;
  
//   try {
      

//     const existingLawyer = await Lawyer.findOne({ email });
//     if (existingLawyer) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);
     
//         let imageUrl = "";

//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "lawyers", // optional folder
//       });

//       imageUrl = result.secure_url;
//     }

    
//     const lawyer = await Lawyer.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       address,
//       specialization,
//       experience,
//       licenseNumber,
//       consultationFee,
//       profileImage : imageUrl,
//       bio,
//     });

//     res.status(201).json({
//       message: 'Lawyer registered successfully',
//       lawyerId: lawyer._id.toString(),
// });
 
   
//   } catch (error) {
//     console.log("register lawyer error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
export const registerLawyer = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    specialization,
    experience,
    licenseNumber,
    consultationFee,
    profileImage,
    bio
  } = req.body;

  try {
    const existingLawyer = await Lawyer.findOne({ email });
    if (existingLawyer) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lawyers",
      });
      imageUrl = result.secure_url;
    }

    const lawyer = await Lawyer.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      specialization,
      experience,
      licenseNumber,
      consultationFee,
      profileImage: imageUrl,
      bio,

      // ✅ ADD THIS
      status: "pending",
    });

    res.status(201).json({
      message: "Registration successful. Wait for admin approval.",
      lawyerId: lawyer._id.toString(),
    });

  } catch (error) {
    console.log("register lawyer error:", error);
    res.status(500).json({ message: error.message });
  }
};
 
//login lawyer
// export const loginLawyer = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const lawyer = await Lawyer.findOne({ email }).select("+password");
//     if (!lawyer) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, lawyer.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }
//     //token generation

//     const token = jwt.sign(
//       {
//         id: lawyer._id,
//         role: "lawyer",
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // ✅ Send proper user object
//     res.status(200).json({
//       token,
//       user: {
//         id: lawyer._id,
//         name: lawyer.name,
//         email: lawyer.email,
//         role: "lawyer",
//         specialization: lawyer.specialization,
//       },
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const loginLawyer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const lawyer = await Lawyer.findOne({ email }).select("+password");

    if (!lawyer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ ADD THIS BLOCK
    if (lawyer.status === "pending") {
      return res.status(403).json({
        message: "Your account is waiting for admin approval",
      });
    }

    if (lawyer.status === "rejected") {
      return res.status(403).json({
        message: "Your account has been rejected by admin",
      });
    }

    const isMatch = await bcrypt.compare(password, lawyer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Token
    const token = jwt.sign(
      {
        id: lawyer._id,
        role: "lawyer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: lawyer._id,
        name: lawyer.name,
        email: lawyer.email,
        role: "lawyer",
        specialization: lawyer.specialization,
        status: lawyer.status, // optional but useful
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// logout lawyer
export const logoutLawyer = (req, res) => {
  res.json({ message: 'Logout successful' });
};

//register admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: 'Admin registered successfully',
      adminId: admin._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send proper user object
    res.status(200).json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//logout admin
export const logoutAdmin = (req, res) => {
  res.json({ message: 'Logout successful' });
};

// forget password

export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    const Model = role === "lawyer" ? Lawyer : Client;

    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send email
    await sendEmail(
  email,
  "🔐 Password Reset OTP - Nyayasetu",
  `
  <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:20px;">
    
    <div style="
      max-width:500px;
      margin:auto;
      background:#ffffff;
      border-radius:8px;
      padding:30px;
      text-align:center;
      box-shadow:0 4px 10px rgba(0,0,0,0.1);
    ">

      <h2 style="color:#2c3e50;">⚖ Nyayasetu</h2>

      <h3 style="color:#333;">Password Reset Request</h3>

      <p>Hello <strong>${user.name}</strong>,</p>

      <p>
        We received a request to reset your password.
        Use the OTP below to continue.
      </p>

      <div style="
        margin:25px 0;
        padding:15px;
        background:#f8f9fa;
        border:2px dashed #3498db;
        font-size:28px;
        font-weight:bold;
        letter-spacing:4px;
        color:#3498db;
      ">
        ${otp}
      </div>

      <p style="color:#555;">
        This OTP will expire in <strong>10 minutes</strong>.
      </p>

      <p style="font-size:14px; color:#888;">
        For security reasons, do not share this OTP with anyone.
      </p>

      <hr style="margin:25px 0;">

      <p style="font-size:12px; color:#999;">
        If you did not request a password reset, please ignore this email.
      </p>

      <p style="font-size:12px; color:#999;">
        © ${new Date().getFullYear()} Nyayasetu. All rights reserved.
      </p>

    </div>

  </div>
  `
);
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verify OTP

export const verifyOTP = async (req, res) => {
  try {
    const { email, role, otp } = req.body;

    const Model = role === "lawyer" ? Lawyer : Client;

    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔥 Check expiry first
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 🔥 Compare as string (safe)
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
   

//reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, role, newPassword } = req.body;

    const Model = role === "lawyer" ? Lawyer : Client;

    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
