
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import cors from "cors";
import { saveMessage } from "./controllers/chatController.js";


dotenv.config();

app.use(cors());

const PORT = process.env.PORT || 5050;

// 🔥 CREATE SERVER
const server = http.createServer(app);

// 🔥 SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ✅ your frontend port
    methods: ["GET", "POST"]
  }
});
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});




// 🔌 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ JOIN USER
 socket.on("joinRoom", (appointmentId) => {
    socket.join(appointmentId);
  });

  // 💬 SEND MESSAGE (FINAL VERSION)
  socket.on("sendMessage", async (data) => {
  console.log("📥 Backend received:", data);

  const { senderId, receiverId, message, appointmentId } = data;

  if (!senderId || !receiverId || !message) {
    console.log("❌ Missing fields:", data);
    return;
  }

  await saveMessage(data);

  io.to(appointmentId).emit("receiveMessage", data);
});
  
  // ❌ DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🚀 START SERVER
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
  }
};

startServer();