import express from "express";
import {
  registerClient,
  loginClient,
  logoutClient,
  registerLawyer,
  loginLawyer,
  logoutLawyer,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";
import { upload } from "../utils/upload.js"
const authRouter = express.Router();


// CLIENT
authRouter.post("/register/client",upload.single("profileImage"), registerClient);
authRouter.post("/login/client", loginClient);
authRouter.post("/logout/client", logoutClient);

// LAWYER
authRouter.post("/register/lawyer",upload.single("profileImage"), registerLawyer);
authRouter.post("/login/lawyer", loginLawyer);
authRouter.post("/logout/lawyer", logoutLawyer);

// ADMIN
authRouter.post("/register/admin",registerAdmin);
authRouter.post("/login/admin", loginAdmin);
authRouter.post("/logout/admin", logoutAdmin);

// forgot password
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-otp",verifyOTP);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
