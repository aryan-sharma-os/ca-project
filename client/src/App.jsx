import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import PatientProfile from "./pages/PatientProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import DoctorDashboardPage from "./pages/doctor/Dashboard.jsx";
import DoctorProfilePage from "./pages/doctor/Profile.jsx";
import DoctorAppointmentsPage from "./pages/doctor/Appointments.jsx";
import DoctorConsultationPage from "./pages/doctor/Consultation.jsx";
import DoctorEarningsPage from "./pages/doctor/Earnings.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute roles={["agent"]} />}>
            <Route path="/agent" element={<AgentDashboard />} />
          </Route>
          <Route element={<ProtectedRoute roles={["doctor"]} />}>
            <Route path="/doctor" element={<DoctorDashboardPage />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
            <Route path="/doctor/profile" element={<DoctorProfilePage />} />
            <Route
              path="/doctor/appointments"
              element={<DoctorAppointmentsPage />}
            />
            <Route
              path="/doctor/consultation"
              element={<DoctorConsultationPage />}
            />
            <Route path="/doctor/earnings" element={<DoctorEarningsPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute roles={["patient"]} />}>
            <Route path="/patient" element={<PatientProfile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
