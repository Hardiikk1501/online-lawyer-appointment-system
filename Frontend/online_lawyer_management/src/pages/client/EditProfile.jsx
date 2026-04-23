import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../assets/STYLES/EditProfileClient.css";

const EditProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: ""
  });
 

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const ur=import.meta.env.VITE_APP_API_URL;
  const API = `${ur}/api`;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        profileImage: res.data.profileImage || ""
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name || !profile.email) {
      return Swal.fire("Warning", "Name & Email required", "warning");
    }

    try {
      setLoading(true);

      await axios.put(`${API}/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire("Success", "Profile Updated", "success");

      navigate("/client");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

 //console.log("TOKEN:", token);
  return (
    <div className="hp-container">
      <h2 className="hp-title">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="hp-card">

        <div className="hp-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </div>

        <div className="hp-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>

        <div className="hp-group hp-full">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>
        <div className="hp-group hp-full">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
        </div>
       
        <button type="submit" className="saving" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          className="canceling"
          onClick={() => navigate("/client")}
        >
          Cancel
        </button>

      </form>
    </div>
  );
};

export default EditProfile;