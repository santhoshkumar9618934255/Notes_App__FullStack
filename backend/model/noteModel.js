const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
  drawing : { type: String } 

}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);
