const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Delete user and all their data
router.delete("/", auth, userController.deleteUser);

module.exports = router;
