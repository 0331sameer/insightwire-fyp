const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

// @route   GET /api/articles/test
// @desc    Test database connection
// @access  Public
router.get("/test", articleController.testDatabase);

// @route   GET /api/articles
// @desc    Get all articles with pagination
// @access  Public
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  res.json({
    success: true,
    data: [],
    pagination: {
      currentPage: page,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: limit,
    },
  });
});

// @route   GET /api/articles/search
// @desc    Search articles
// @access  Public
router.get("/search", articleController.searchArticles);

// @route   GET /api/articles/stats/bias
// @desc    Get bias statistics
// @access  Public
router.get("/stats/bias", articleController.getBiasStatistics);

// @route   GET /api/articles/bias/:bias
// @desc    Get articles by bias
// @access  Public
router.get("/bias/:bias", articleController.getArticlesByBias);

// @route   GET /api/articles/:id
// @desc    Get single article by ID
// @access  Public
router.get("/:id", articleController.getArticleById);

module.exports = router;
