const { CategorizedArticle, Article } = require("../models");

const categorizedArticleController = {
  // Get all categorized articles with populated article details including bias
  getAllCategorizedArticles: async (req, res) => {
    try {
      const categorizedArticles = await CategorizedArticle.find()
        .populate({
          path: "articles",
          model: "Article",
          select:
            "title url content date publication biasness score image_url articlesperscpectives artcles_categorized",
        })
        .sort({ createdAt: -1 });

      // Map the data to include bias information clearly
      const mappedArticles = categorizedArticles.map((catArticle) => ({
        _id: catArticle._id,
        title: catArticle.title,
        summary: catArticle.summary,
        image_url: catArticle.image_url,
        Background: catArticle.Background,
        Analytics: catArticle.Analytics,
        createdAt: catArticle.createdAt,
        updatedAt: catArticle.updatedAt,
        articles: catArticle.articles.map((article) => ({
          _id: article._id,
          title: article.title,
          url: article.url,
          content: article.content,
          date: article.date,
          publication: article.publication,
          bias: article.biasness, // Mapping biasness to bias for clarity
          score: article.score,
          image_url: article.image_url,
          hasPerscpectives: article.articlesperscpectives,
          isCategorized: article.artcles_categorized,
        })),
      }));

      res.status(200).json({
        success: true,
        count: mappedArticles.length,
        data: mappedArticles,
      });
    } catch (error) {
      console.error("Error fetching categorized articles:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching categorized articles",
        error: error.message,
      });
    }
  },

  // Search categorized articles
  searchCategorizedArticles: async (req, res) => {
    try {
      const { q, sort = "relevance", bias = "all" } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      // Build search query
      let searchQuery = {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { summary: { $regex: q, $options: "i" } },
          { Background: { $regex: q, $options: "i" } },
        ],
      };

      // Find categorized articles that match the search query
      let query = CategorizedArticle.find(searchQuery).populate({
        path: "articles",
        model: "Article",
        select:
          "title url content date publication biasness score image_url articlesperscpectives artcles_categorized",
      });

      // Apply sorting
      switch (sort) {
        case "newest":
          query = query.sort({ createdAt: -1 });
          break;
        case "oldest":
          query = query.sort({ createdAt: 1 });
          break;
        case "articles":
          // Will sort by article count after fetching
          break;
        case "relevance":
        default:
          // Default sort by relevance (MongoDB text search scoring)
          break;
      }

      const categorizedArticles = await query;

      // Map and filter the results
      let mappedArticles = categorizedArticles.map((catArticle) => {
        const articles = catArticle.articles.map((article) => ({
          _id: article._id,
          title: article.title,
          url: article.url,
          content: article.content,
          date: article.date,
          publication: article.publication,
          bias: article.biasness,
          score: article.score,
          image_url: article.image_url,
          hasPerscpectives: article.articlesperscpectives,
          isCategorized: article.artcles_categorized,
        }));

        // Calculate bias distribution
        const biasCount = { left: 0, center: 0, right: 0 };
        articles.forEach((article) => {
          const articleBias = article.bias?.toLowerCase() || "center";
          if (biasCount.hasOwnProperty(articleBias)) {
            biasCount[articleBias]++;
          } else {
            biasCount.center++;
          }
        });

        const totalArticles = articles.length;
        const biasDistribution = {
          left: biasCount.left,
          center: biasCount.center,
          right: biasCount.right,
          leftPercentage:
            totalArticles > 0
              ? Math.round((biasCount.left / totalArticles) * 100)
              : 0,
          centerPercentage:
            totalArticles > 0
              ? Math.round((biasCount.center / totalArticles) * 100)
              : 0,
          rightPercentage:
            totalArticles > 0
              ? Math.round((biasCount.right / totalArticles) * 100)
              : 0,
        };

        return {
          _id: catArticle._id,
          title: catArticle.title,
          summary: catArticle.summary,
          image_url: catArticle.image_url,
          Background: catArticle.Background,
          Analytics: catArticle.Analytics,
          createdAt: catArticle.createdAt,
          updatedAt: catArticle.updatedAt,
          articleCount: articles.length,
          articles: articles,
          biasDistribution: biasDistribution,
        };
      });

      // Apply bias filter if specified
      if (bias !== "all") {
        mappedArticles = mappedArticles.filter((catArticle) => {
          return catArticle.articles.some(
            (article) => article.bias?.toLowerCase() === bias.toLowerCase()
          );
        });
      }

      // Apply article count sorting if specified
      if (sort === "articles") {
        mappedArticles.sort((a, b) => b.articleCount - a.articleCount);
      }

      res.status(200).json({
        success: true,
        count: mappedArticles.length,
        data: mappedArticles,
        query: q,
        filters: { sort, bias },
      });
    } catch (error) {
      console.error("Error searching categorized articles:", error);
      res.status(500).json({
        success: false,
        message: "Error searching categorized articles",
        error: error.message,
      });
    }
  },

  // Get a single categorized article by ID with populated articles
  getCategorizedArticleById: async (req, res) => {
    try {
      const { id } = req.params;

      const categorizedArticle = await CategorizedArticle.findById(id).populate(
        {
          path: "articles",
          model: "Article",
          select:
            "title url content date publication biasness score image_url articlesperscpectives artcles_categorized",
        }
      );

      if (!categorizedArticle) {
        return res.status(404).json({
          success: false,
          message: "Categorized article not found",
        });
      }

      // Map the data to include bias information clearly
      const mappedArticle = {
        _id: categorizedArticle._id,
        title: categorizedArticle.title,
        summary: categorizedArticle.summary,
        image_url: categorizedArticle.image_url,
        Background: categorizedArticle.Background,
        Analytics: categorizedArticle.Analytics,
        createdAt: categorizedArticle.createdAt,
        updatedAt: categorizedArticle.updatedAt,
        articles: categorizedArticle.articles.map((article) => ({
          _id: article._id,
          title: article.title,
          url: article.url,
          content: article.content,
          date: article.date,
          publication: article.publication,
          bias: article.biasness, // Mapping biasness to bias for clarity
          score: article.score,
          image_url: article.image_url,
          hasPerscpectives: article.articlesperscpectives,
          isCategorized: article.artcles_categorized,
        })),
      };

      res.status(200).json({
        success: true,
        data: mappedArticle,
      });
    } catch (error) {
      console.error("Error fetching categorized article:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching categorized article",
        error: error.message,
      });
    }
  },

  // Get categorized articles filtered by bias
  getCategorizedArticlesByBias: async (req, res) => {
    try {
      const { bias } = req.params; // left, right, or center

      if (!["left", "right", "center"].includes(bias)) {
        return res.status(400).json({
          success: false,
          message: "Invalid bias parameter. Must be left, right, or center",
        });
      }

      // First find articles with the specified bias
      const articlesWithBias = await Article.find({ biasness: bias }).select(
        "_id"
      );
      const articleIds = articlesWithBias.map((article) => article._id);

      // Then find categorized articles that contain these article IDs
      const categorizedArticles = await CategorizedArticle.find({
        articles: { $in: articleIds },
      })
        .populate({
          path: "articles",
          model: "Article",
          select:
            "title url content date publication biasness score image_url articlesperscpectives artcles_categorized",
        })
        .sort({ createdAt: -1 });

      // Map and filter to only include articles with the specified bias
      const mappedArticles = categorizedArticles
        .map((catArticle) => ({
          _id: catArticle._id,
          title: catArticle.title,
          summary: catArticle.summary,
          image_url: catArticle.image_url,
          Background: catArticle.Background,
          Analytics: catArticle.Analytics,
          createdAt: catArticle.createdAt,
          updatedAt: catArticle.updatedAt,
          articles: catArticle.articles
            .filter((article) => article.biasness === bias)
            .map((article) => ({
              _id: article._id,
              title: article.title,
              url: article.url,
              content: article.content,
              date: article.date,
              publication: article.publication,
              bias: article.biasness,
              score: article.score,
              image_url: article.image_url,
              hasPerscpectives: article.articlesperscpectives,
              isCategorized: article.artcles_categorized,
            })),
        }))
        .filter((catArticle) => catArticle.articles.length > 0); // Only return categorized articles that have articles with the specified bias

      res.status(200).json({
        success: true,
        bias: bias,
        count: mappedArticles.length,
        data: mappedArticles,
      });
    } catch (error) {
      console.error("Error fetching categorized articles by bias:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching categorized articles by bias",
        error: error.message,
      });
    }
  },

  // Get bias distribution for a specific categorized article
  getBiasDistribution: async (req, res) => {
    try {
      const { id } = req.params;

      const categorizedArticle = await CategorizedArticle.findById(id).populate(
        {
          path: "articles",
          model: "Article",
          select: "biasness",
        }
      );

      if (!categorizedArticle) {
        return res.status(404).json({
          success: false,
          message: "Categorized article not found",
        });
      }

      // Calculate bias distribution
      const biasDistribution = categorizedArticle.articles.reduce(
        (acc, article) => {
          acc[article.biasness] = (acc[article.biasness] || 0) + 1;
          return acc;
        },
        {}
      );

      res.status(200).json({
        success: true,
        categorizedArticleId: id,
        totalArticles: categorizedArticle.articles.length,
        biasDistribution: biasDistribution,
      });
    } catch (error) {
      console.error("Error calculating bias distribution:", error);
      res.status(500).json({
        success: false,
        message: "Error calculating bias distribution",
        error: error.message,
      });
    }
  },
};

module.exports = categorizedArticleController;
