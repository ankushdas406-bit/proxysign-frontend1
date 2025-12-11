import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function StudentScanner() {
  const [sessionId, setSessionId] = useState("");
  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Extract sessionId from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session");
    setSessionId(id);
  }, []);

  const submitAttendance = () => {
    if (!roll.trim()) return alert("Enter your Roll Number");

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const studentLocation = {
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
        };

        const res = await fetch(`${API_URL}/api/attendance/mark`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            studentRoll: roll,
            location: studentLocation,
          }),
        });

        const data = await res.text();
        setMessage(data);
        setLoading(false);
      } catch (err) {
        setMessage("Failed to mark attendance. Try again.");
        setLoading(false);
      }
    });
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className="card p-3 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h4 className="text-center">Mark Attendance</h4>
        {sessionId ? (
          <>
            <input
              className="form-control mt-3"
              placeholder="Enter Roll Number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
            />

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={submitAttendance}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Attendance"}
            </button>
          </>
        ) : (
          <p className="text-danger mt-3">
            Invalid or expired QR. Please ask teacher for new QR.
          </p>
        )}

        {message && (
          <p className="text-center mt-3 fw-bold text-success">{message}</p>
        )}
      </div>
    </div>
  );
}
