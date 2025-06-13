const express = require("express");
const router = express.Router();
const perspectiveController = require("../controllers/perspectiveController");
const auth = require("../middleware/auth");

// @route   GET /api/perspectives
// @desc    Get all perspectives
// @access  Public
router.get("/", perspectiveController.getAllPerspectives);

// @route   GET /api/perspectives/articles/:articleId
// @desc    Get perspectives for a specific article
// @access  Public
router.get(
  "/articles/:articleId",
  perspectiveController.getPerspectivesByArticleId
);

// @route   GET /api/perspectives/articles/:articleId/:perspectiveType
// @desc    Get specific perspective type (left, right, center) for an article
// @access  Public
router.get(
  "/articles/:articleId/:perspectiveType",
  perspectiveController.getSpecificPerspective
);

// @route   GET /api/perspectives/articles/:articleId/compare
// @desc    Compare perspectives side by side
// @access  Public
router.get(
  "/articles/:articleId/compare",
  perspectiveController.comparePerspectives
);

// @route   GET /api/perspectives/articles-with-perspectives
// @desc    Get articles that have perspectives available
// @access  Public
router.get(
  "/articles-with-perspectives",
  perspectiveController.getArticlesWithPerspectives
);

module.exports = router;
