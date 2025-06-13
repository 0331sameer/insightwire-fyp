const SavedCategory = require("../models/SavedCategory");

const savedCategoryController = {
  // Save a category for a user
  saveCategory: async (req, res) => {
    try {
      const { categoryId, categoryTitle, categoryImageUrl } = req.body;
      const userId = req.user; // From auth middleware

      if (!categoryId || !categoryTitle) {
        return res.status(400).json({
          success: false,
          error: "Category ID and title are required",
        });
      }

      // Check if category is already saved
      const existingSave = await SavedCategory.findOne({ userId, categoryId });
      if (existingSave) {
        return res.status(400).json({
          success: false,
          error: "Category is already saved",
        });
      }

      // Create new saved category
      const savedCategory = new SavedCategory({
        userId,
        categoryId,
        categoryTitle,
        categoryImageUrl,
      });

      await savedCategory.save();

      res.status(201).json({
        success: true,
        message: "Category saved successfully",
        data: savedCategory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to save category",
        details: error.message,
      });
    }
  },

  // Remove a saved category
  unsaveCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const userId = req.user; // From auth middleware

      const deletedSave = await SavedCategory.findOneAndDelete({
        userId,
        categoryId,
      });

      if (!deletedSave) {
        return res.status(404).json({
          success: false,
          error: "Saved category not found",
        });
      }

      res.json({
        success: true,
        message: "Category unsaved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to unsave category",
      });
    }
  },

  // Get all saved categories for a user
  getSavedCategories: async (req, res) => {
    try {
      const userId = req.user; // From auth middleware
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const savedCategories = await SavedCategory.find({ userId })
        .sort({ savedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "userName email");

      const total = await SavedCategory.countDocuments({ userId });

      res.json({
        success: true,
        data: savedCategories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch saved categories",
      });
    }
  },

  // Check if a category is saved by user
  checkSavedStatus: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const userId = req.user; // From auth middleware

      const savedCategory = await SavedCategory.findOne({ userId, categoryId });

      res.json({
        success: true,
        isSaved: !!savedCategory,
        savedAt: savedCategory ? savedCategory.savedAt : null,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to check saved status",
        details: error.message,
      });
    }
  },
};

module.exports = savedCategoryController;
