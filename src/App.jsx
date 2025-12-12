import React from "react";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AdminControlPage from "./Pages/AdminControlPage";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentScanPage from "./Pages/StudentScanPage";


const USERS = {
  admin: { email: "admin@proxysign.com", pass: "admin123", roll: "ADMIN" },
  student: { email: "student@global.edu", pass: "student123", roll: "2231490" }
};


export default function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
const [studentRoll, setStudentRoll] = useState("");

  const handleLogin = (email, pass) => {
    const foundRole = Object.keys(USERS).find(
      (r) => USERS[r].email === email && USERS[r].pass === pass
    );

    if (foundRole) {
  setRole(foundRole);
  setAuthenticated(true);
  setStudentRoll(USERS[foundRole].roll);
}
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setRole("");
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="layout">
      <Sidebar
        role={role}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
      />

      <div className="content">
        <Topbar role={role} />

        {/* Admin Controls Dashboard */}
        {activePage === "dashboard" && role === "admin" && (
          <AdminControlPage />
        )}

        {/* Student Dashboard */}
        {activePage === "dashboard" && role === "student" && (
          <StudentDashboard />
        )}

        {/* Student QR Scan */}
        {activePage === "qr" && role === "student" && (
          <StudentScanPage studentRoll={studentRoll} />

        )}

        {/* Prevent admin from scanning */}
        {activePage === "qr" && role === "admin" && (
          <p>Admin manages QR generation from Control Center.</p>
        )}
      </div>
    </div>
  );
}

// LOGIN SCREEN COMPONENT
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="login-bg">
      <div className="login-glass">
        <h1 className="logo-text">ProxySign</h1>
        <h3 className="college-text">Global Group of Colleges</h3>

        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button onClick={() => onLogin(email, pass)}>
          Sign In
        </button>

        <p className="hint">Use your assigned role credentials</p>
      </div>
    </div>
  );
}
