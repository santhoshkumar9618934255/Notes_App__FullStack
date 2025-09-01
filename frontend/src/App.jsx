import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotesForm from './components/NotesForm';

import './App.css'; // Add some basic styling

const API_URL = 'http://localhost:8000/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get(API_URL);
    setNotes(res.data);
  };

  const handleCreateOrUpdate = async (note) => {
    if (currentNote) {
      await axios.put(`${API_URL}/${currentNote._id}`, note);
    } else {
      await axios.post(API_URL, note);
    }
    setCurrentNote(null);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchNotes();
  };

  const handleEdit = (note) => {
    setCurrentNote(note);
  };

  return (
    <div className="app-container">
      <h1>MERN Stack Notes App</h1>
      <NotesForm
        currentNote={currentNote}
        onSave={handleCreateOrUpdate}
      />
      <NotesList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;