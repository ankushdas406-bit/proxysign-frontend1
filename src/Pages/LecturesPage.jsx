import { useState } from "react";

export default function LecturesPage() {
  const [lectures, setLectures] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState("");

  const [name, setName] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [teacher, setTeacher] = useState("");

  const handleAddTeacher = () => {
    if (!newTeacher.trim()) return alert("Enter teacher name");

    setTeachers([...teachers, newTeacher]);
    setNewTeacher("");
  };

  const handleAddLecture = () => {
    if (!name.trim()) return alert("Enter lecture name");
    if (!teacher.trim()) return alert("Select a teacher");

    const newLec = {
      id: "L-" + (lectures.length + 101),
      name,
      branch,
      teacher,
    };

    setLectures([...lectures, newLec]);
    setName("");
    setTeacher("");
  };

  const handleDeleteLecture = (id) => {
    setLectures(lectures.filter((l) => l.id !== id));
  };

  return (
    <div className="lecture-container">
      <h1 className="page-title">Manage Lectures</h1>

      {/* Add Teacher Section */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3>Add Teacher</h3>
        <input
          type="text"
          placeholder="Teacher Name"
          value={newTeacher}
          onChange={(e) => setNewTeacher(e.target.value)}
        />
        <button onClick={handleAddTeacher}>Add Teacher</button>
      </div>

      {/* Add Lecture Section */}
      <div className="card add-lecture-card">
        <input
          type="text"
          placeholder="Lecture Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
  type="text"
  placeholder="Branch / Section (ex: CSE-3A)"
  value={branch}
  onChange={(e) => setBranch(e.target.value)}
/>


        <select
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {teachers.map((t, i) => (
            <option key={i}>{t}</option>
          ))}
        </select>

        <button onClick={handleAddLecture}>Add Lecture</button>
      </div>

      {/* Table */}
      <div className="glass-table">
        <div className="table-header">
          <span>ID</span>
          <span>Lecture Name</span>
          <span>Branch</span>
          <span>Teacher</span>
          <span>Action</span>
        </div>

        {lectures.map((lec) => (
          <div className="table-row" key={lec.id}>
            <span>{lec.id}</span>
            <span>{lec.name}</span>
            <span>{lec.branch}</span>
            <span>{lec.teacher}</span>
            <button
              className="row-delete"
              onClick={() => handleDeleteLecture(lec.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
