import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { API_URL } from "../config";
import React from "react";


export default function AdminControlPage() {
  const [tab, setTab] = useState("teachers");
  const [timer, setTimer] = useState(0);

  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState("");

  const [lectures, setLectures] = useState([]);
  const [newLecture, setNewLecture] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [sessions, setSessions] = useState([]);
  const [qrData, setQrData] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedQrLectureId, setSelectedQrLectureId] = useState("");
  const [activeSession, setActiveSession] = useState(null);



  const loadTeachers = () => fetch(`${API_URL}/api/attendance/teacher`).then(r => r.json()).then(setTeachers);
  const loadLectures = () => fetch(`${API_URL}/api/attendance/lecture`).then(r => r.json()).then(setLectures);
  const loadSessions = () => fetch(`${API_URL}/api/attendance/session`).then(r => r.json()).then(setSessions);
  const loadAttendance = () => fetch(`${API_URL}/api/attendance/all`).then(r => r.json()).then(setAttendanceRecords);

  useEffect(() => { loadTeachers(); loadLectures(); }, []);
  useEffect(() => {
    if (tab === "qr") loadSessions();
    if (tab === "attendance") loadAttendance();
  }, [tab]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const addTeacher = async () => {
    if (!newTeacher.trim()) return alert("Enter teacher name");
    await fetch(`${API_URL}/api/attendance/teacher`,
      { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeacher }) });
    setNewTeacher("");
    loadTeachers();
  };

  const deleteTeacher = async (id) => {
    await fetch(`${API_URL}/api/attendance/teacher/${id}`, { method: "DELETE" });
    loadTeachers();
  };

  const addLecture = async () => {
    if (!newLecture.trim()) return alert("Enter lecture name");
    if (!selectedTeacher.trim()) return alert("Select teacher");
    await fetch(`${API_URL}/api/attendance/lecture`,
      { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLecture, teacher: selectedTeacher }) });
    setNewLecture(""); setSelectedTeacher("");
    loadLectures();
  };

  const deleteLecture = async (id) => {
    await fetch(`${API_URL}/api/attendance/lecture/${id}`, { method: "DELETE" });
    loadLectures();
  };

  const generateQR = async () => {
  if (!selectedQrLectureId) return alert("Select a lecture for QR");

  const lecture = lectures.find((l) => l._id === selectedQrLectureId);
  if (!lecture) return alert("Lecture not found");

  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const adminLocation = {
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
      };

      const createdAt = new Date().toLocaleString();

      const res = await fetch(`${API_URL}/api/attendance/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lectureId: lecture._id,
          lectureName: lecture.name,
          adminLocation,
          createdAt
        })
      });

      const session = await res.json();

      // Store session so UI can show lecture name, date, location, timer
      setActiveSession(session);

      // Create QR with clickable URL (Google Lens compatible)
      const qrURL = `${window.location.origin}/scan?session=${session._id}`;
      setQrData(qrURL);

      // Start countdown timer
      setTimer(300); // 5 minutes = 300 secs

      // Reload session list
      loadSessions();
      
    } catch (err) {
      console.error("QR Generation Error:", err);
      alert("Failed to create session");
    }
  });
};


const deleteSession = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/attendance/session/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Delete failed on server:", errorText);
      alert("Delete failed on server");
      return;
    }

    // Force reload active sessions from backend
    loadSessions();
    setQrData("");
    setTimer(0);
  } catch (error) {
    console.error("Delete error:", error);
  }
};




  return (
    <div className="admin-layout">

      {/* TABS */}
      <div className="segmented-control">
        {["teachers","lectures","qr","attendance"].map(tabName => (
          <button key={tabName}
            className={tab === tabName ? "active" : ""}
            onClick={() => setTab(tabName)}>
            {tabName.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TEACHERS TAB */}
      {tab === "teachers" && (
        <div className="card">
          <h3>Add Teacher</h3>
          <input value={newTeacher} placeholder="Teacher Name"
            onChange={(e)=>setNewTeacher(e.target.value)} />
          <button onClick={addTeacher}>Save</button>

          <div className="glass-table">
            {teachers.map(t => (
              <div className="table-row" key={t._id}>
                <span>{t.name}</span>
                <button className="row-delete" onClick={()=>deleteTeacher(t._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LECTURES TAB */}
      {tab === "lectures" && (
        <div className="card">
          <h3>Add Lecture</h3>
          <input placeholder="Lecture" value={newLecture}
            onChange={(e)=>setNewLecture(e.target.value)} />
          <select value={selectedTeacher}
            onChange={(e)=>setSelectedTeacher(e.target.value)}>
            <option value="">Select Teacher</option>
            {teachers.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
          </select>
          <button onClick={addLecture}>Save</button>

          <div className="glass-table">
            {lectures.map(l => (
              <div className="table-row" key={l._id}>
                <span>{l.name}</span>
                <span>{l.teacher}</span>
                <button className="row-delete" onClick={()=>deleteLecture(l._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR TAB */}
      {tab === "qr" && (
        <div className="card">
          <h3>QR Attendance Session</h3>
          <select
  value={selectedQrLectureId}
  onChange={(e) => setSelectedQrLectureId(e.target.value)}
  style={{ marginTop: "12px", marginBottom: "12px" }}
>
  <option value="">Select Lecture for QR</option>
  {lectures.map((lec) => (
    <option key={lec._id} value={lec._id}>
      {lec.name} — {lec.teacher}
    </option>
  ))}
</select>

          <button onClick={generateQR}>Generate QR</button>

          {qrData && (
  <div className="qrBox" style={{ textAlign: "center" }}>
    <QRCode value={qrData} size={200} />

    {activeSession && (
      <div style={{ marginTop: "12px" }}>
        <p><strong>Lecture:</strong> {activeSession.lectureName}</p>
        <p><strong>Location:</strong>
          {activeSession.adminLocation?.lat.toFixed(5)},{" "}
          {activeSession.adminLocation?.long.toFixed(5)}
        </p>
       <p><strong>Time:</strong> {new Date(activeSession.createdAt).toLocaleString()}</p>


        {timer > 0 ? (
          <p className="timer">
            Expires in: {Math.floor(timer / 60)}:
            {String(timer % 60).padStart(2, "0")}
          </p>
        ) : (
          <p className="expired">QR EXPIRED</p>
        )}
      </div>
    )}
  </div>
)}



          {/* List of all active sessions */}
          <div className="glass-table">
            {sessions.map(s => (
              <div className="table-row" key={s._id}>
                
                <button className="row-delete" onClick={()=>deleteSession(s._id)}>Delete QR</button>
              </div>
            ))} 
          </div>
        </div>
      )}

      {/* ATTENDANCE TAB */}
    
{tab === "attendance" && (
  <div className="card">
    <h3>Attendance Records</h3>

    <div className="glass-table">
      <div className="table-header">
        <span>Roll</span>
        <span>Lecture</span>
        <span>Lat</span>
        <span>Long</span>
        <span>IP</span>
        <span>Time</span>
      </div>

      {attendanceRecords.map((rec, i) => (
        <div className="table-row" key={i}>
          <span>{rec.studentRoll}</span>
          <span>{rec.lectureId}</span>
          <span>{rec.location?.lat}</span>
          <span>{rec.location?.long}</span>
          <span>{rec.ip}</span>
          <span>{new Date(rec.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  </div>
)} 

    </div>
  );
}
