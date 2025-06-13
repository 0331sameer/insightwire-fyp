const mongoose = require("mongoose");

const categorizedArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        required: true,
      },
    ],
    image_url: {
      type: String,
      required: false,
    },
    Background: {
      type: String,
      default: "None",
    },
    Analytics: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
categorizedArticleSchema.index({ title: "text", summary: "text" });

const CategorizedArticle = mongoose.model(
  "CategorizedArticle",
  categorizedArticleSchema
);

module.exports = CategorizedArticle;
