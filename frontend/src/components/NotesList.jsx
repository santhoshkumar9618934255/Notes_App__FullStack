import React from "react";
import "./NotesList.css"; 
import { useNavigate } from "react-router-dom";

const NotesList = ({ notes, onEdit, onDelete }) => {
  const navigate=useNavigate();

  const update_notes=()=>{
    navigate("/updatenotes")
  }

  return (
    <div className="notesList-container">
      {notes.length === 0 ? (
        <p className="no-notes">No notes found.</p>
      ) : (
        notes.map((note) => (
          <div className="note-card" key={note.id}>
            <p  className="note-title">ID:{note.id}</p>
            <h3 className="note-title">Title:{note.title}</h3>

            {/* Display text content */}
            {note.context && <p className="note-content">Content:{note.context}</p>}
                 
            {/* Display drawing if exists */}
            {/* {note.drawingURL && (
              <img
                src={note.drawingURL}
                alt="Drawing"
                className="note-drawing"
                style={{ width: "300px", border: "1px solid #ccc", marginTop: "10px" }}
              />
            )} */}
              
            <div className="note-actions">
              <button className="fa fa-edit" onClick={()=>navigate(`/updatenotes/${note.id}`)}>
                
              </button>
              <button className="fa fa-trash" onClick={() => onDelete(note.id)}>
                
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotesList;
