
import jwt from "jsonwebtoken";
import Client from "../models/Client.js";
import Lawyer from "../models/Lawyer.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Important: Check role from token
    if (decoded.role === "client") {
      req.user = await Client.findById(decoded.id).select("-password");
    } else if (decoded.role === "lawyer") {
      req.user = await Lawyer.findById(decoded.id).select("-password");
    }
    else if (decoded.role === "admin") {
      req.user = await Admin.findById(decoded.id).select("-password");
    }
   

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};
