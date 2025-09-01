const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();


app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);


const noteRoutes = require("./routes/noteRoutes");  
app.use("/api", noteRoutes);  
app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*'); // allow cross-origin
  }
}));




mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB Connected"))
.catch((err) => console.error(" MongoDB Connection Error:", err));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
