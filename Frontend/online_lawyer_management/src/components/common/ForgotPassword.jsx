import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/STYLES/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API = "http://localhost:5050/api/auth";

  // STEP 1 - SEND OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API}/forgot-password`, {
        email,
        role,
      });

      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  // STEP 2 - VERIFY OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API}/verify-otp`, {
        email,
        otp,
        role,
      });

      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }

    setLoading(false);
  };

  // STEP 3 - RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API}/reset-password`, {
        email,
        newPassword,
        role,
      });

      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }

    setLoading(false);
  };

 return (
  <div className="forgot-wrapper">
    <div className="forgot-left">
      <h1>FORGOT</h1>
      <h1 className="light">PASSWORD</h1>
      <p>Secure your account in 3 easy steps</p>
    </div>

    <div className="forgot-card">
      <h2>Reset Password</h2>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {/* STEP 1 */}
      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="lawyer">Lawyer</option>
          </select>

          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* STEP 2 - OTP BOXES */}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <div className="otp-container">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                maxLength="1"
                className="otp-box"
                onChange={(e) => {
                  let newOtp = otp.split("");
                  newOtp[i] = e.target.value;
                  setOtp(newOtp.join(""));

                  // auto focus next
                  if (e.target.nextSibling) {
                    e.target.nextSibling.focus();
                  }
                }}
              />
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <div className="password-field">
            <input
              type="password"
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Update Password"}
          </button>
        </form>
      )}

      <p className="back-login" onClick={() => navigate("/login")}>
        ← Back to Login
      </p>
    </div>
  </div>
);
}

export default ForgotPassword;

