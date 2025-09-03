const express = require("express");
const { register, login } = require("../controller/userController");
const jwt = require("jsonwebtoken");
const router = express.Router();


router.post("/register", register);
router.post("/login", login);


router.get("/verify-token", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) return res.status(401).json({ valid: false });

  try {
    jwt.verify(token, process.env.SECRET);
    res.json({ valid: true });
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(403).json({ valid: false });
  }
});

module.exports = router;
