import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NotesList from "./NotesList";
import "./Dashboard.css";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/getNotes");
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/delete/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const add_notes = () => navigate("/newnotes");


  const filteredNotes = notes.filter((note) =>
    note.id.toString().includes(searchId)
  );


  const logout=()=>{
    navigate("/login")
  }
  return (
    <div className="dashboard-container">
      <button className="Logout" onClick={logout}>Logout</button>

      <h1 className="My_notes">My Notes</h1>

      <input type="text" placeholder="Search by Note ID..." value={searchId} onChange={(e) => setSearchId(e.target.value)} className="search-bar" />
     <br />
      <NotesList notes={filteredNotes} onDelete={handleDelete} />



      <br />
      <button onClick={add_notes} className="add_notes_bt">Add Notes</button>
    
    </div>
  );
};

export default Dashboard;
