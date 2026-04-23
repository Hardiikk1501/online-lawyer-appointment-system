
import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaLock, FaPhone,
  FaMapMarkerAlt, FaBriefcase, FaIdCard, FaMoneyBill
} from "react-icons/fa";
import Swal from "sweetalert2";
import "../../assets/STYLES/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("Client");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    licenseNumber: "",
    consultationFee: "",
    bio: "",
  });

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* STEP VALIDATION */
  const validateStep = () => {
    let newErrors = {};

  if (step === 1) {
  if (!formData.name.trim()) {
    newErrors.name = "Name required";
  }

  const email = formData.email.trim().toLowerCase();

  if (!email) {
    newErrors.email = "Email required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    newErrors.email = "Enter valid email (example@gmail.com)";
  }

if (!formData.password) {
  newErrors.password = "Password required";
} else if (formData.password.length < 6) {
  newErrors.password = "Minimum 6 characters required";
} else if (!/[A-Z]/.test(formData.password)) {
  newErrors.password = "At least one uppercase letter required";
} else if (!/[0-9]/.test(formData.password)) {
  newErrors.password = "At least one number required";
}
}

    if (step === 2) {
      if (!formData.phone) newErrors.phone = "Phone required";
      if (!formData.address) newErrors.address = "Address required";
    }

    if (step === 3 && role === "Lawyer") {
      if (!formData.specialization) newErrors.specialization = "Required";
      if (!formData.licenseNumber) newErrors.licenseNumber = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* STEP NAVIGATION */
  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        role === "Client"
          ? `${import.meta.env.VITE_API_URL}/api/auth/register/client`
          : `${import.meta.env.VITE_API_URL}/api/auth/register/lawyer`;

     // await axios.post(url, { ...formData, role });
      const data = new FormData();
        // append text fields
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // append role
    data.append("role", role);

    // ✅ append image
    if (image) {
      data.append("profileImage", image);
    }

    await axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

      await Swal.fire({
        title: "Success!",
        text: "Account created successfully",
        icon: "success",
      });

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">

      {/* LEFT PANEL */}
      <div className="register-left">


       <p>Your one-stop solution for all legal needs. Whether you're seeking expert legal advice or looking to offer your services as a lawyer, LegalEase makes it easy to connect and collaborate. Join us today and experience the future of legal services!</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="register-right">
        <div className="register-card">

          <h2>Create Account</h2>

          {/* ROLE */}
          <div className="role-toggle">
            <button
              className={role === "Client" ? "active" : ""}
              onClick={() => setRole("Client")}
            >
              Client
            </button>
            <button
              className={role === "Lawyer" ? "active" : ""}
              onClick={() => setRole("Lawyer")}
            >
              Lawyer
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            {/* PROGRESS */}
            <div className="progress-bar">
              <div style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h3>Basic Info</h3>

                <div className="input-group">
                  <FaUser />
                  <input name="name" placeholder="Full Name" onChange={handleChange} />
                </div>
                {errors.name && <p className="error">{errors.name}</p>}

                <div className="input-group">
                  <FaEnvelope />
                  <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                </div>
                {errors.email && <p className="error">{errors.email}</p>}

                <div className="input-group">
                  <FaLock />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>

                {errors.password && <p className="error">{errors.password}</p>}
                <div className="input-group">
                  <FaBriefcase/>
                    <input
                          type="file"
                          name = "profileImage"
                           onChange={(e) => setImage(e.target.files[0])}
                     />

                </div>

                <button type="button" className="single-next-btn" onClick={nextStep}>
                  Next
                </button> 
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h3>Contact Info</h3>

                <div className="input-group">
                  <FaPhone />
                  <input name="phone" placeholder="Phone" onChange={handleChange} />
                </div>
                {errors.phone && <p className="error">{errors.phone}</p>}

                <div className="input-group">
                  <FaMapMarkerAlt />
                  <input name="address" placeholder="Address" onChange={handleChange} />
                </div>
                {errors.address && <p className="error">{errors.address}</p>}

                <div className="step-buttons">
                  <button type="button" onClick={prevStep}>Back</button>
                  <button type="button" onClick={nextStep}>Next</button>
                </div>
              </>
            )}

            {/* STEP 3 (LAWYER) */}
            {step === 3 && role === "Lawyer" && (
              <>
                <h3>Professional Info</h3>

                <div className="input-group">
                  <FaBriefcase />
                  <select name="specialization" onChange={handleChange}>
                    <option value="">Specialization</option>
                    <option value="Criminal">Criminal</option>
                   <option value="Civil">Civil</option>
                  <option value="Family">Family</option>
                   <option value="Corporate">Corporate</option>
                  <option value="Property">Property</option>
                  <option value="Cyber">Cyber</option>
                   <option value="Other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <FaIdCard />
                  <input name="licenseNumber" placeholder="License Number" onChange={handleChange} />
                </div>
                <div className="input-group">
                  <FaBriefcase />
                  <input name="experience" placeholder="Experience (Years)" onChange={handleChange} />
                </div>
                <div className="input-group">
                  <FaMoneyBill />
                  <input name="consultationFee" placeholder="Consultation Fee" onChange={handleChange} />
                </div>
                <div className="input-group"> 
                <textarea name="bio" placeholder="Short Bio" onChange={handleChange} className="bio-textarea" />  
                </div>

                <div className="step-buttons">
                  <button type="button" onClick={prevStep}>Back</button>
                  <button type="button" onClick={nextStep}>Next</button>
                </div>
              </>
            )}

            {/* FINAL STEP */}
            {(step === 3 && role === "Client") || step === 4 ? (
              <>
                <h3>Review</h3>

                <p><b>Name:</b> {formData.name}</p>
                <p><b>Email:</b> {formData.email}</p>
                <p><b>Phone:</b> {formData.phone}</p>
                <p><b>Address:</b> {formData.address}</p>

                  {role === "Lawyer" && (
                  <>
                    <p><b>Specialization:</b> {formData.specialization}</p>
                    <p><b>License Number:</b> {formData.licenseNumber}</p>
                    <p><b>Experience:</b> {formData.experience}</p>
                    <p><b>Consultation Fee:</b> ₹{formData.consultationFee}</p>
                    
                  </>
                )}


                <div className="step-buttons">
                  <button type="button" onClick={prevStep}>Back</button>
                  <button type="submit">Submit</button>
                </div>
              </>
            ) : null}

          </form>

          <p className="login-text">
            Already have an account? <NavLink to="/login">Login</NavLink>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
