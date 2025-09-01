const express = require("express");
const multer = require("multer");
const router = express.Router();
const noteController = require("../controller/noteController");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  }
});

const upload = multer({ storage: storage });

// Routes
router.get("/getNotes", noteController.getNotes);
router.get("/getNotes/:id",noteController.getNotesById)
router.post("/save", upload.single("drawing"), noteController.postNotes);
router.put("/update/:id", upload.single("drawing"), noteController.updateNotes);
router.delete("/delete/:id",noteController.deleteNote)


module.exports = router;
