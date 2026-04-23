

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../assets/STYLES/BookAppointment.css";

function BookAppointment() {

  const { lawyerId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [description, setDescription] = useState("");

  const [bookedSlots, setBookedSlots] = useState([]);
  const [lockedSlots, setLockedSlots] = useState([]);

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "5:00 PM",
  ];

  // Redirect if not logged in
  useEffect(() => {

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first",
      }).then(() => navigate("/login"));
    }

  }, [token, navigate]);


  // Fetch booked + locked slots
  useEffect(() => {

    if (!date || !lawyerId) return;

    const fetchSlots = async () => {

      try {

        const res = await axios.get(
          `${API}/appointments/booked/${lawyerId}?date=${date}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setBookedSlots(res.data.booked || []);
        setLockedSlots(res.data.locked || []);

      } catch (error) {

        console.error("Error fetching slots:", error);

      }
    };

    fetchSlots();

  }, [lawyerId, date, token]);


  // Lock slot temporarily
  const handleSlotSelect = async (slot) => {

    try {

      await axios.post(
        `${API}/appointments/lock-slot`,
        {
          lawyerId : lawyerId,
          date : date,
          timeSlot: slot
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTimeSlot(slot);

    } catch (error) {

      Swal.fire(
        "Slot Unavailable",
        "This slot is currently locked by another user.",
        "warning"
      );

    }

  };


  // Send appointment request
  const handleBooking = async () => {

    if (!date || !timeSlot || !description) {
      return Swal.fire("Error", "Fill all fields", "error");
    }

    try {

      setLoading(true);

      await axios.post(
        `${API}/create-appointment`,
        {
          lawyerId,
          appointmentDate: date,
          timeSlot,
          description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Appointment Requested",
        text: "Your appointment request has been sent successfully."
      });

      navigate("/client");

    } catch (error) {

      Swal.fire(
        "Error",
        error.response?.data?.message || "Booking failed",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="booking-container">

      <div className="booking-card">

        <h2>Book Appointment</h2>

        {/* Date */}

        <div className="form-group">

          <label>Select Date</label>

          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setDate(e.target.value);
              setTimeSlot("");
            }}
          />

        </div>


        {/* Time Slots */}

        {date && (

          <div className="slots-container">

            <h3>Select Time Slot</h3>

            <div className="slots-grid">

              {timeSlots.map((slot) => {

                const isBooked = bookedSlots.includes(slot);
                const isLocked = lockedSlots.includes(slot);

                return (

                  <button
                    key={slot}
                    className={`slot-btn 
                      ${isBooked || isLocked ? "disabled" : ""}
                      ${timeSlot === slot ? "selected" : ""}
                    `}
                    disabled={isBooked || isLocked || loading}
                    onClick={() => handleSlotSelect(slot)}
                  >

                    {slot}

                    {isBooked && " (Booked)"}
                    {isLocked && " (Locked)"}

                  </button>

                );

              })}

            </div>

          </div>

        )}


        {/* Description */}

        <div className="form-group">

          <label>Case Description</label>

          <textarea
            placeholder="Describe your case..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

        </div>


        {/* Submit */}

        <button
          className="confirm-btn"
          onClick={handleBooking}
          disabled={loading}
        >

          {loading ? "Processing..." : "Send Appointment Request"}

        </button>

      </div>

    </div>

  );

}

export default BookAppointment;