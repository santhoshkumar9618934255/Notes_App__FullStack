import React, { useState, useEffect } from 'react';

const NotesForm = ({ currentNote, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text"placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
      <br /><br />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} ></textarea>
      <br /><br />
      <button type="submit">{currentNote ? 'Update Note' : 'Add Note'}</button>
    </form>
  );
};

export default NotesForm;