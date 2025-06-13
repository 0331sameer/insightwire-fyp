const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const auth = require("../middleware/auth");

// Add feedback (requires auth)
router.post("/", auth, feedbackController.addFeedback);

// Get feedback for a category (public)
router.get("/:categoryId", feedbackController.getFeedbackForCategory);

// Get all feedback by the current user (requires auth)
router.get("/user/all", auth, feedbackController.getUserFeedback);

module.exports = router;
