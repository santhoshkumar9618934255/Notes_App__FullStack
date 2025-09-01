const Note = require("../model/noteModel");

exports.postNotes = async (req, res) => {
  try {
    const data = req.body;

  
    if (req.file) {
      data.drawing = req.file.path; 
    }

    const newNote = new Note(data);
    const result = await newNote.save();

    res.status(201).json({ message: "Note saved successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getNotesById = async (req, res) => {
  try {
    const id = req.params.id;  

    const result = await Note.findOne({ id: id }); 

    if (!result) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching note", error: err.message });
  }
};



exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find();  

   
    const notesWithURL = notes.map(note => ({
      id: note.id,
      title: note.title,
      context: note.context,
      drawingURL: note.drawing ? `http://localhost:8080/${note.drawing}` : null,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    }));

    res.status(200).json(notesWithURL);  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNotes = async (req, res) => {
  try {
    const { id } = req.params;   // your custom id
    const { title, content } = req.body;

    // Prepare update object
    const updateData = { title, content };

    // If a drawing file is uploaded, include it
    if (req.file) {
      updateData.drawing = req.file.filename; // or req.file.path depending on your setup
    }

    const updatedNote = await Note.findOneAndUpdate(
      { id: id },                // match by custom id
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};






exports.deleteNote=async (req,res)=>{
    try{
    const id=req.params.id
    const result=await Note.findOneAndDelete(id);
    res.status(200).json({message:"Record Deleted successfully"})
    }catch(err){
        res.send("Error while deleting" ,err)
    }
}

