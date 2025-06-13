const Feedback = require("../models/Feedback");

const feedbackController = {
  // Add feedback/comment to a category
  addFeedback: async (req, res) => {
    try {
      const { categoryId, comment, userName } = req.body;
      const userId = req.user;

      if (!categoryId || !comment || !userName) {
        return res
          .status(400)
          .json({ success: false, error: "All fields are required." });
      }
      const feedback = new Feedback({ userId, userName, categoryId, comment });
      await feedback.save();

      res.status(201).json({
        success: true,
        message: "Feedback submitted.",
        data: feedback,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to submit feedback." });
    }
  },

  // Get all feedback for a category
  getFeedbackForCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const feedbackList = await Feedback.find({ categoryId }).sort({
        createdAt: -1,
      });
      res.json({ success: true, data: feedbackList });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch feedback." });
    }
  },

  // Get all feedback by the current user
  getUserFeedback: async (req, res) => {
    try {
      const userId = req.user;
      const feedbackList = await Feedback.find({ userId }).sort({
        createdAt: -1,
      });
      res.json({ success: true, data: feedbackList });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch user feedback." });
    }
  },
};

module.exports = feedbackController;
