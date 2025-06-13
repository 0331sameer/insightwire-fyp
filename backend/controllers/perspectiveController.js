const { Perspective, Article } = require("../models");

const perspectiveController = {
  // Get perspectives for a specific article
  getPerspectivesByArticleId: async (req, res) => {
    try {
      const { articleId } = req.params;

      // Check if article exists
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }

      const perspective = await Perspective.findOne({
        original_article_id: articleId,
      }).populate({
        path: "original_article_id",
        model: "Article",
        select: "title url publication date biasness score image_url",
      });

      if (!perspective) {
        return res.status(404).json({
          success: false,
          message: "No perspectives found for this article",
        });
      }

      const mappedPerspective = {
        _id: perspective._id,
        original_article: {
          _id: perspective.original_article_id._id,
          title: perspective.original_article_id.title,
          url: perspective.original_article_id.url,
          publication: perspective.original_article_id.publication,
          date: perspective.original_article_id.date,
          originalBias: perspective.original_article_id.biasness,
          score: perspective.original_article_id.score,
          image_url: perspective.original_article_id.image_url,
        },
        perspectives: {
          left: perspective.left_version,
          right: perspective.right_version,
          center: perspective.center_version,
        },
        createdAt: perspective.createdAt,
        updatedAt: perspective.updatedAt,
      };

      res.status(200).json({
        success: true,
        data: mappedPerspective,
      });
    } catch (error) {
      console.error("Error fetching perspectives:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching perspectives",
        error: error.message,
      });
    }
  },

  // Get all perspectives
  getAllPerspectives: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const perspectives = await Perspective.find()
        .populate({
          path: "original_article_id",
          model: "Article",
          select: "title url publication date biasness score image_url",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Perspective.countDocuments();

      const mappedPerspectives = perspectives.map((perspective) => ({
        _id: perspective._id,
        original_article: {
          _id: perspective.original_article_id._id,
          title: perspective.original_article_id.title,
          url: perspective.original_article_id.url,
          publication: perspective.original_article_id.publication,
          date: perspective.original_article_id.date,
          originalBias: perspective.original_article_id.biasness,
          score: perspective.original_article_id.score,
          image_url: perspective.original_article_id.image_url,
        },
        perspectives: {
          left: perspective.left_version,
          right: perspective.right_version,
          center: perspective.center_version,
        },
        createdAt: perspective.createdAt,
        updatedAt: perspective.updatedAt,
      }));

      res.status(200).json({
        success: true,
        data: mappedPerspectives,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Error fetching all perspectives:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching perspectives",
        error: error.message,
      });
    }
  },

  // Get specific perspective version (left, right, or center)
  getSpecificPerspective: async (req, res) => {
    try {
      const { articleId, perspectiveType } = req.params;

      if (!["left", "right", "center"].includes(perspectiveType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid perspective type. Must be left, right, or center",
        });
      }

      const perspective = await Perspective.findOne({
        original_article_id: articleId,
      }).populate({
        path: "original_article_id",
        model: "Article",
        select: "title url publication date biasness score image_url",
      });

      if (!perspective) {
        return res.status(404).json({
          success: false,
          message: "No perspectives found for this article",
        });
      }

      const perspectiveField = `${perspectiveType}_version`;
      const perspectiveContent = perspective[perspectiveField];

      res.status(200).json({
        success: true,
        data: {
          _id: perspective._id,
          original_article: {
            _id: perspective.original_article_id._id,
            title: perspective.original_article_id.title,
            url: perspective.original_article_id.url,
            publication: perspective.original_article_id.publication,
            date: perspective.original_article_id.date,
            originalBias: perspective.original_article_id.biasness,
            score: perspective.original_article_id.score,
            image_url: perspective.original_article_id.image_url,
          },
          requestedPerspective: {
            type: perspectiveType,
            content: perspectiveContent,
          },
          createdAt: perspective.createdAt,
          updatedAt: perspective.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error fetching specific perspective:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching specific perspective",
        error: error.message,
      });
    }
  },

  // Compare perspectives side by side
  comparePerspectives: async (req, res) => {
    try {
      const { articleId } = req.params;
      const { perspectives = "left,right,center" } = req.query;

      const requestedPerspectives = perspectives
        .split(",")
        .filter((p) => ["left", "right", "center"].includes(p.trim()));

      if (requestedPerspectives.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one valid perspective type is required",
        });
      }

      const perspective = await Perspective.findOne({
        original_article_id: articleId,
      }).populate({
        path: "original_article_id",
        model: "Article",
        select: "title url publication date biasness score image_url content",
      });

      if (!perspective) {
        return res.status(404).json({
          success: false,
          message: "No perspectives found for this article",
        });
      }

      const comparison = {
        _id: perspective._id,
        original_article: {
          _id: perspective.original_article_id._id,
          title: perspective.original_article_id.title,
          url: perspective.original_article_id.url,
          publication: perspective.original_article_id.publication,
          date: perspective.original_article_id.date,
          originalBias: perspective.original_article_id.biasness,
          score: perspective.original_article_id.score,
          image_url: perspective.original_article_id.image_url,
          originalContent: perspective.original_article_id.content,
        },
        perspectives: {},
      };

      requestedPerspectives.forEach((type) => {
        const perspectiveField = `${type}_version`;
        comparison.perspectives[type] = perspective[perspectiveField];
      });

      res.status(200).json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      console.error("Error comparing perspectives:", error);
      res.status(500).json({
        success: false,
        message: "Error comparing perspectives",
        error: error.message,
      });
    }
  },

  // Get articles that have perspectives available
  getArticlesWithPerspectives: async (req, res) => {
    try {
      const { page = 1, limit = 10, bias } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build filter for articles
      const articleFilter = { articlesperscpectives: true };
      if (bias && ["left", "right", "center"].includes(bias)) {
        articleFilter.biasness = bias;
      }

      const articles = await Article.find(articleFilter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Article.countDocuments(articleFilter);

      const mappedArticles = articles.map((article) => ({
        _id: article._id,
        title: article.title,
        url: article.url,
        publication: article.publication,
        date: article.date,
        bias: article.biasness,
        score: article.score,
        image_url: article.image_url,
        hasPerscpectives: article.articlesperscpectives,
        isCategorized: article.artcles_categorized,
      }));

      res.status(200).json({
        success: true,
        data: mappedArticles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Error fetching articles with perspectives:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching articles with perspectives",
        error: error.message,
      });
    }
  },
};

module.exports = perspectiveController;
