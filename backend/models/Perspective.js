const mongoose = require("mongoose");

const perspectiveSchema = new mongoose.Schema(
  {
    original_article_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    left_version: {
      type: String,
      required: true,
    },
    right_version: {
      type: String,
      required: true,
    },
    center_version: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
perspectiveSchema.index({ original_article_id: 1 });

const Perspective = mongoose.model("Perspective", perspectiveSchema);

module.exports = Perspective;
