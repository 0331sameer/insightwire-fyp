const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Accept string for dev
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
