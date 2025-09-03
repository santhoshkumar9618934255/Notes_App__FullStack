const mongoose = require("mongoose");
const { RegisterSchema } = require('../validators/auth.validators'); 

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', function (next) {
  try {
    // Validate only the needed fields
    RegisterSchema.parse({
      name: this.name,
      email: this.email,
      password: this.password
    });
    next();
  } catch (error) {
    next(error); // Pass error to Mongoose
  }
});

module.exports = mongoose.model("User", userSchema);
