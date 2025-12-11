import React from "react";
export default function Topbar({ role }) {
  return (
    <header className="topbar">
      <h3>Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
    </header>
  );
}
