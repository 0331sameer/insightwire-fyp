const express = require("express");
const router = express.Router();
const savedCategoryController = require("../controllers/savedCategoryController");
const auth = require("../middleware/auth");

// All routes require authentication
router.use(auth);

// POST /api/saved-categories - Save a category
router.post("/", savedCategoryController.saveCategory);

// DELETE /api/saved-categories/:categoryId - Unsave a category
router.delete("/:categoryId", savedCategoryController.unsaveCategory);

// GET /api/saved-categories - Get all saved categories for user
router.get("/", savedCategoryController.getSavedCategories);

// GET /api/saved-categories/check/:categoryId - Check if category is saved
router.get("/check/:categoryId", savedCategoryController.checkSavedStatus);

module.exports = router;
