import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import"../../assets/STYLES/Payment.css";

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5050/api";

  
  useEffect(() => {
    fetchAppointment();
  }, [id]); // ✅ added dependency

  const fetchAppointment = async () => {
    try {
      const res = await axios.get(`${API}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("appointment data :",res.data);
      setAppointment(res.data);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to load appointment", "error");
    }
  };

  const loadRazorpay = async () => {
    try {
      // ✅ safety check
      if (!appointment) {
        Swal.fire("Error", "Appointment not loaded", "error");
        return;
      }

      // ✅ Create order
    const { data: order } = await axios.post(
  `${API}/payment/create-order`,
  {
    amount: appointment.amount || 1, // ✅ FIXED
    // amount: (appointment.amount || 1) * 100
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

const options = {
  key: "rzp_test_STxxeRFWlBbQPO",
  amount: order.amount,
  currency: "INR",
  name: "Nyayasetu",
  description: "Lawyer Appointment Payment",
  order_id: order.id,

  handler: async function (response) {
    // (optional success logic)
    console.log("Payment success", response);
  },

  // ✅ THIS IS THE MAIN PART
  modal: {
    ondismiss: async () => {
      try {
        console.log("User closed Razorpay");

        await axios.post(
          `${API}/payment/mark-paid`,
          {
            appointmentId: id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Swal.fire(
          "success",
          "payment successful",
          "success"
        );

        navigate("/client");

      } catch (error) {
        console.log(error.response?.data || error.message);

        Swal.fire(
          "Error",
          "Failed payment",
          "error"
        );
      }
    }
  },

  theme: {
    color: "#3399cc"
  }
};
      // ✅ Razorpay init
      if (!window.Razorpay) {
        Swal.fire("Error", "Razorpay SDK not loaded", "error");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Payment initiation failed", "error");
    }
  };

  if (!appointment) return <h3>Loading...</h3>;

  return (
    <div className="paymentinfo" >
      <h2>Appointment Payment</h2>

      <p><b>Lawyer:</b> {appointment.lawyerId?.name}</p>
      <p>
        <b>Date:</b>{" "}
        {new Date(appointment.appointmentDate).toLocaleDateString()}
      </p>
      <p><b>Time:</b> {appointment.timeSlot}</p>

      <h3>Amount: ₹{appointment.amount}</h3>

      <button
        onClick={loadRazorpay}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}

export default PaymentPage;