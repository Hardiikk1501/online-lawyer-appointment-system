

import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

// Protected Routes
import ProtectedAdminRoute from "./Utils/ProtectedAdminRoute";
import ClientProtectedRoute from "./Utils/ClientProtectedRoute";

// Common Pages
import About from "./pages/common/About";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import NotFound from "./pages/common/NotFound";
import Home from "./pages/common/Home";
import LawyerList from "./pages/common/LawyerList";

// Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ForgotPassword from "./components/common/ForgotPassword";

// Lawyer Pages
import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import LawyerProfile from "./pages/lawyer/LawyerProfile";

// Appointment
import BookAppointment from "./pages/appointment/BookAppointment";

// Client
import ClientDashboard from "./pages/client/ClientDashboard";
import EditProfile from "./pages/client/EditProfile";
// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import Report from "./pages/admin/Report";
import Administer from "./Utils/Administer";
// Payment
import PaymentPage from "./pages/Payment/PaymentPage";

// Chat
import Chat from "./components/chat/Chat";

/* ✅ Layout wrapper to hide Navbar/Footer for chat */
function Layout({ Role, setRole, children }) {
  const location = useLocation();

  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <>
      {!isChatPage && <Navbar Role={Role} setRole={setRole} />}

      {children}

      {!isChatPage && <Footer />}
    </>
  );
}

function App() {
  const [Role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  console.log("Current role in App.jsx:", Role);

  return (
    <BrowserRouter>
      <Layout Role={Role} setRole={setRole}>
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setRole={setRole} />} />
          <Route path="/lawyers" element={<LawyerList />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
    
          {/* User Pages */}
          <Route path="/lawyer" element={<LawyerDashboard />} />
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />
          <Route path="/client/edit-profile" element={<EditProfile />} /> 
          {/* Payment */}
          <Route path="/payment/:id" element={<PaymentPage />} />

          {/* Chat (FULL SCREEN) */}
          <Route path="/chat/:appointmentId" element={<Chat />} />
          
          {/* Protected Client Route */}
          <Route
            path="/book/:lawyerId"
            element={
              <ClientProtectedRoute>
                <BookAppointment />
              </ClientProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/reports" element={<Report />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
            <Route path="/Auth/administer/register" element={<Administer />} />
          
        </Routes>
      </Layout>
      
    </BrowserRouter>
  );
}

export default App;
