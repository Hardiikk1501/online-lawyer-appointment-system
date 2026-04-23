

import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import clientRouter from "./routes/clientRoutes.js";
import LawyerRouter from "./routes/lawyerRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import MessageRouter from "./routes/chatRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();



/* 🔥 CORS MUST BE HERE */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* 🔥 Handle preflight requests */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  
/* 🔥 Routes */
app.use("/api/auth", authRouter);
app.use("/api", clientRouter);
app.use("/api/lawyer", LawyerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/messages", MessageRouter);
app.use("/api/payment", paymentRouter);


/* 🔥 Error middleware should be LAST */
app.use(errorMiddleware);

export default app;