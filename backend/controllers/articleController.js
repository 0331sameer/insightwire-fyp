const { Article, CategorizedArticle } = require("../models");

// Article controller loaded

const articleController = {
  // Test database connection and content
  testDatabase: async (req, res) => {
    try {
      // Check if we can connect and count documents
      const count = await Article.countDocuments();

      // Get a sample of articles to see their structure
      const sampleArticles = await Article.find().limit(3);

      res.status(200).json({
        success: true,
        message: "Database test successful",
        articleCount: count,
        sampleArticles: sampleArticles,
      });
    } catch (error) {
      console.error("Database test failed:", error);
      res.status(500).json({
        success: false,
        message: "Database test failed",
        error: error.message,
      });
    }
  },

  // Mock data for when database is not available
  getMockArticles: () => {
    return [
      {
        _id: "mock1",
        title: "Tech Innovation Drives Market Growth",
        url: "https://example.com/tech-innovation",
        content:
          "Technology companies continue to lead market growth with innovative solutions across various sectors. The integration of AI and machine learning has revolutionized how businesses operate, leading to increased efficiency and customer satisfaction.",
        date: new Date("2025-01-15"),
        publication: "Tech Today",
        biasness: "center",
        score: 0.75,
        image_url:
          "https://via.placeholder.com/400x300/0066cc/ffffff?text=Tech+Innovation",
        articlesperscpectives: false,
        artcles_categorized: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "mock2",
        title: "Economic Policies Show Positive Results",
        url: "https://example.com/economic-policies",
        content:
          "Recent economic policies implemented by the government have shown promising results in reducing unemployment and boosting consumer confidence. Experts believe these measures will continue to strengthen the economy in the coming quarters.",
        date: new Date("2025-01-14"),
        publication: "Economic Times",
        biasness: "right",
        score: 0.68,
        image_url:
          "https://via.placeholder.com/400x300/cc6600/ffffff?text=Economic+Growth",
        articlesperscpectives: true,
        artcles_categorized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "mock3",
        title: "Climate Action Urgently Needed",
        url: "https://example.com/climate-action",
        content:
          "Environmental scientists warn that immediate action is required to address climate change. New research shows that without significant policy changes, global temperatures could rise beyond critical thresholds within the next decade.",
        date: new Date("2025-01-13"),
        publication: "Green Planet News",
        biasness: "left",
        score: 0.82,
        image_url:
          "https://via.placeholder.com/400x300/009900/ffffff?text=Climate+Action",
        articlesperscpectives: true,
        artcles_categorized: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "mock4",
        title: "Healthcare Innovations Transform Patient Care",
        url: "https://example.com/healthcare-innovations",
        content:
          "Revolutionary healthcare technologies are transforming patient care with telemedicine, AI diagnostics, and personalized treatment plans. Hospitals report improved patient outcomes and reduced costs.",
        date: new Date("2025-01-12"),
        publication: "Medical Weekly",
        biasness: "center",
        score: 0.79,
        image_url:
          "https://via.placeholder.com/400x300/cc0066/ffffff?text=Healthcare+Tech",
        articlesperscpectives: false,
        artcles_categorized: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "mock5",
        title: "Education Reform Sparks Debate",
        url: "https://example.com/education-reform",
        content:
          "Proposed education reforms have sparked intense debate among educators, parents, and policymakers. While supporters argue for modernization, critics worry about funding and implementation challenges.",
        date: new Date("2025-01-11"),
        publication: "Education Today",
        biasness: "left",
        score: 0.71,
        image_url:
          "https://via.placeholder.com/400x300/6600cc/ffffff?text=Education+Reform",
        articlesperscpectives: true,
        artcles_categorized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  },

  // Get all articles
  getAllArticles: async (req, res) => {
    try {
      // Parse pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Parse filter parameters
      const bias = req.query.bias; // 'left', 'right', 'center'
      const publication = req.query.publication;
      const searchTerm = req.query.search;

      // Build filter object
      let filter = {};

      if (bias) {
        filter.biasness = bias;
      }

      if (publication) {
        filter.publication = publication;
      }

      if (searchTerm) {
        filter.$or = [
          { title: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
        ];
      }

      try {
        // Get total count for pagination
        const total = await Article.countDocuments(filter);

        // Get paginated articles
        const articles = await Article.find(filter)
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

        // Map articles to include clear bias field
        const mappedArticles = articles.map((article) => ({
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
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
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
      } catch (dbError) {
        console.log("Database error:", dbError.message);
        console.log("Database not available, using mock data");
        // Use mock data if database is not available
        const mockArticles = articleController.getMockArticles();
        const mockMappedArticles = mockArticles.slice(
          skip,
          skip + parseInt(limit)
        );
        const mockTotal = mockArticles.length;

        res.status(200).json({
          success: true,
          data: mockMappedArticles,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(mockTotal / parseInt(limit)),
            totalItems: mockTotal,
            itemsPerPage: parseInt(limit),
          },
        });
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch articles",
      });
    }
  },

  // Get article by ID
  getArticleById: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await Article.findById(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }

      const mappedArticle = {
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
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      };

      res.status(200).json({
        success: true,
        data: mappedArticle,
      });
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching article",
        error: error.message,
      });
    }
  },

  // Get articles by bias
  getArticlesByBias: async (req, res) => {
    try {
      const { bias } = req.params;
      const { page = 1, limit = 10 } = req.query;

      if (!["left", "right", "center"].includes(bias)) {
        return res.status(400).json({
          success: false,
          message: "Invalid bias parameter. Must be left, right, or center",
        });
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const articles = await Article.find({ biasness: bias })
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Article.countDocuments({ biasness: bias });

      const mappedArticles = articles.map((article) => ({
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
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      }));

      res.status(200).json({
        success: true,
        bias: bias,
        data: mappedArticles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Error fetching articles by bias:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching articles by bias",
        error: error.message,
      });
    }
  },

  // Search articles
  searchArticles: async (req, res) => {
    try {
      const { query, bias, publication, page = 1, limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      // Build filter object
      const filter = {
        $text: { $search: query },
      };

      if (bias && ["left", "right", "center"].includes(bias)) {
        filter.biasness = bias;
      }
      if (publication) {
        filter.publication = publication;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const articles = await Article.find(filter, {
        score: { $meta: "textScore" },
      })
        .sort({ score: { $meta: "textScore" }, date: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Article.countDocuments(filter);

      const mappedArticles = articles.map((article) => ({
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
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      }));

      res.status(200).json({
        success: true,
        query: query,
        data: mappedArticles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Error searching articles:", error);
      res.status(500).json({
        success: false,
        message: "Error searching articles",
        error: error.message,
      });
    }
  },

  // Get bias statistics
  getBiasStatistics: async (req, res) => {
    try {
      const biasStats = await Article.aggregate([
        {
          $group: {
            _id: "$biasness",
            count: { $sum: 1 },
            avgScore: { $avg: "$score" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const totalArticles = await Article.countDocuments();

      const formattedStats = biasStats.map((stat) => ({
        bias: stat._id,
        count: stat.count,
        percentage: ((stat.count / totalArticles) * 100).toFixed(2),
        averageScore: stat.avgScore.toFixed(4),
      }));

      res.status(200).json({
        success: true,
        totalArticles: totalArticles,
        biasDistribution: formattedStats,
      });
    } catch (error) {
      console.error("Error fetching bias statistics:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching bias statistics",
        error: error.message,
      });
    }
  },

  // Get related articles from the same category
  getRelatedArticles: async (req, res) => {
    try {
      const { id } = req.params;

      // First, get the current article
      const article = await Article.findById(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }

      // Check if the article is categorized
      if (!article.artcles_categorized) {
        return res.status(200).json({
          success: true,
          message: "This category has not yet been applied.",
          remaining_count: 0,
          remaining_articles: [],
        });
      }

      // Find the categorized article that contains this article ID
      const categorizedArticle = await CategorizedArticle.findOne({
        articles: id,
      }).populate({
        path: "articles",
        model: "Article",
        select: "title url content date publication biasness score image_url",
      });

      if (!categorizedArticle) {
        return res.status(200).json({
          success: true,
          message: "No categorized article found for this article.",
          remaining_count: 0,
          remaining_articles: [],
        });
      }

      // Get remaining articles (exclude current article)
      const remainingArticles = categorizedArticle.articles
        .filter((relatedArticle) => relatedArticle._id.toString() !== id)
        .map((relatedArticle) => ({
          _id: relatedArticle._id,
          title: relatedArticle.title,
          url: relatedArticle.url,
          date: relatedArticle.date,
          publication: relatedArticle.publication,
          bias: relatedArticle.biasness,
          score: relatedArticle.score,
          image_url: relatedArticle.image_url,
          snippet: relatedArticle.content
            ? relatedArticle.content.substring(0, 100) + "..."
            : "No content available...",
        }));

      // Calculate bias distribution
      const totalArticles = categorizedArticle.articles.length;
      const biasCount = { left: 0, center: 0, right: 0 };

      categorizedArticle.articles.forEach((article) => {
        if (article.biasness && biasCount.hasOwnProperty(article.biasness)) {
          biasCount[article.biasness]++;
        }
      });

      const biasPercentages = {
        left:
          totalArticles > 0
            ? Math.round((biasCount.left / totalArticles) * 100)
            : 0,
        center:
          totalArticles > 0
            ? Math.round((biasCount.center / totalArticles) * 100)
            : 0,
        right:
          totalArticles > 0
            ? Math.round((biasCount.right / totalArticles) * 100)
            : 0,
      };

      res.status(200).json({
        success: true,
        category_id: categorizedArticle._id,
        category_title: categorizedArticle.title,
        category_summary: categorizedArticle.summary,
        category_image_url: categorizedArticle.image_url,
        article_count: totalArticles,
        bias_percentages: biasPercentages,
        remaining_count: remainingArticles.length,
        remaining_articles: remainingArticles,
      });
    } catch (error) {
      console.error("Error fetching related articles:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching related articles",
        error: error.message,
      });
    }
  },
};

module.exports = articleController;
