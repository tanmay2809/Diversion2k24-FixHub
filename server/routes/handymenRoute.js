const express = require("express");
const protect2 = require("../middleware/authMiddleware");
const {
  registerHandymen,
  loginHandymen,
  getHandymen,
} = require("../controllers/handymenController");


const router = express.Router();

router.post("/register", registerHandymen);
router.post("/login", loginHandymen);
router.get("/profile", protect2, getHandymen);

module.exports = router;