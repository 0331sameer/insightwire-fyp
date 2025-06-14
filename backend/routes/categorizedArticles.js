const express = require("express");
const router = express.Router();
const categorizedArticleController = require("../controllers/categorizedArticleController");
const auth = require("../middleware/auth");

// @route   GET /api/categorized-articles
// @desc    Get all categorized articles with populated bias data
// @access  Public
router.get("/", categorizedArticleController.getAllCategorizedArticles);

// @route   GET /api/categorized-articles/search
// @desc    Search categorized articles by title, summary, background
// @access  Private
router.get(
  "/search",
  auth,
  categorizedArticleController.searchCategorizedArticles
);

// @route   GET /api/categorized-articles/bias/:bias
// @desc    Get categorized articles filtered by bias
// @access  Public
router.get(
  "/bias/:bias",
  categorizedArticleController.getCategorizedArticlesByBias
);

// @route   GET /api/categorized-articles/:id
// @desc    Get categorized article by ID
// @access  Public
router.get("/:id", categorizedArticleController.getCategorizedArticleById);

// @route   GET /api/categorized-articles/:id/bias-distribution
// @desc    Get bias distribution for a categorized article
// @access  Public
router.get(
  "/:id/bias-distribution",
  categorizedArticleController.getBiasDistribution
);

module.exports = router;
