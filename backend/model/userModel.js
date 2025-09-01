const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true }

})
module.exports = mongoose.model("User", userShema);