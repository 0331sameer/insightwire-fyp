const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth");
const articleRoutes = require("./articles");
const categorizedArticleRoutes = require("./categorizedArticles");
const perspectiveRoutes = require("./perspectives");
const savedCategoryRoutes = require("./savedCategoryRoutes");
const feedbackRoutes = require("./feedbackRoutes");
const userRoutes = require("./userRoutes");

// Use routes
router.use("/auth", authRoutes);
router.use("/articles", articleRoutes);
router.use("/categorized-articles", categorizedArticleRoutes);
router.use("/perspectives", perspectiveRoutes);
router.use("/saved-categories", savedCategoryRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/user", userRoutes);

module.exports = router;
