const mongoose = require("mongoose");

const savedCategorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    categoryTitle: {
      type: String,
      required: true,
    },
    categoryImageUrl: {
      type: String,
      required: false,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to prevent duplicate saves
savedCategorySchema.index({ userId: 1, categoryId: 1 }, { unique: true });

// Index for better query performance
savedCategorySchema.index({ userId: 1, savedAt: -1 });

const SavedCategory = mongoose.model("SavedCategory", savedCategorySchema);

module.exports = SavedCategory;
