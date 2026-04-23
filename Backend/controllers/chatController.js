import Message from "../models/Message.js";

// ✅ Get all messages
export const getMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const messages = await Message.find({ appointmentId })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Save message (used by socket)
export const saveMessage = async (data) => {
  try {
    const { appointmentId, senderId, receiverId, message } = data;

    // 🚨 validation
    if (!appointmentId || !senderId || !receiverId || !message) {
      console.log("❌ Missing fields:", data);
      return;
    }

    const newMessage = new Message({
      appointmentId,
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();
  } catch (error) {
    console.log("Save Message Error:", error.message);
  }
};

// ✅ Send message (API version)
export const sendMessage = async (req, res) => {
  try {
    const { appointmentId, senderId, receiverId, message } = req.body;
  //        // 🚨 DEBUG
  // console.log("Sending:", {
  //   appointmentId,
  //   senderId: userId,
  //   receiverId,
  //   message,
  // });
    // 🚨 validation
    if (!appointmentId || !senderId || !receiverId || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // console.log("📩 New Message:", {
    //   appointmentId,
    //   senderId,
    //   receiverId,
    //   message,
    // });

    const newMessage = new Message({
      appointmentId,
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Send Message Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};