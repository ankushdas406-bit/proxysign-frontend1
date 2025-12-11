import React from "react";
import { FaChalkboardTeacher, FaUserGraduate, FaQrcode, FaSignOutAlt, FaUserShield } from "react-icons/fa";


export default function Sidebar({ role, activePage, onNavigate, onLogout }) 
 {
  const items =
    role === "admin"
      ? [
          { id: "dashboard", label: "Dashboard", icon: <FaUserShield /> },
          { id: "lectures", label: "Lectures" },
          { id: "students", label: "Students" },
          { id: "qr", label: "Scan QR", icon: <FaQrcode /> }

        ]
      : role === "teacher"
      ? [
          { id: "dashboard", label: "Dashboard", icon: <FaChalkboardTeacher /> },
          { id: "qr", label: "QR Attendance", icon: <FaQrcode /> },
        ]
      : [
          { id: "dashboard", label: "Dashboard", icon: <FaUserGraduate /> },
          { id: "qr", label: "Scan QR", icon: <FaQrcode /> },
        ];

  return (
    <aside className="sidebar">
      <h2 className="logo">ProxySign</h2>

      <nav>
        {items.map((item) => (
          <button
  key={item.id}
  className={`sidebar-btn ${activePage === item.id ? "active" : ""}`}
  onClick={() => onNavigate(item.id)}
>
  {item.icon} {item.label}
</button>

        ))}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}
