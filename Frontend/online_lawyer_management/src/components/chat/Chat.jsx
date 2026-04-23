import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../assets/STYLES/Chat.css";



function ChatPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  
  const { appointmentId } = useParams();
  const location = useLocation();

  const receiverId = location.state?.receiverId; // ✅ FIX
  const userId = location.state?.userId;
  const receiverName = location.state?.receiverName;


  //   // ✅ DEBUG LOGS (PUT HERE)
  // console.log("userId:", userId);
  // console.log("receiverId:", receiverId);


  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(`${import.meta.env.VITE_API_URL}`);

    socketRef.current.emit("joinRoom", appointmentId);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messages/${appointmentId}`
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    fetchMessages();

    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [appointmentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    // 🚨 DEBUG
    console.log("userId:", userId);
    console.log("receiverId:", receiverId);

    if (!userId || !receiverId) {
      console.error("❌ Missing senderId or receiverId");
      return;
    }

    const msgData = {
      appointmentId,
      senderId: userId,
      receiverId,
      message,
    };

    console.log("📩 Sending:", msgData);

    socketRef.current.emit("sendMessage", msgData);

   
    setMessage("");
  };

  return (

    <div className="chat-container">
      <div className="chat-window">

     <div className="chat-header">
  <div className="user-info">
    <div className="avatar">
      ⚖️
    </div>

    <div>
      <h4>{receiverName||"User"}</h4>
      <span className="status online">● Online</span>
    </div>
  </div>

  <button className="close" onClick={() => navigate(`/${role}`)}>
    Exit
  </button>
</div>
    
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.senderId === userId ? "my-msg" : "other-msg"}
          >
            {msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
    </div>
  );
}

export default ChatPage;