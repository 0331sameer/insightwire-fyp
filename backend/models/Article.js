const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    publication: {
      type: String,
      required: true,
    },
    biasness: {
      type: String,
      enum: ["left", "right", "center"],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    image_url: {
      type: String,
      required: false,
    },
    articlesperscpectives: {
      type: Boolean,
      default: false,
    },
    artcles_categorized: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
articleSchema.index({ title: "text", content: "text" });
articleSchema.index({ date: -1 });
articleSchema.index({ publication: 1 });
articleSchema.index({ biasness: 1 });

// Force use the "Articles" collection (uppercase)
const Article = mongoose.model("Article", articleSchema, "Articles");

module.exports = Article;
