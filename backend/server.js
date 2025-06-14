const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Import routes
const routes = require("./routes");

// MongoDB connection
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb+srv://jamshidjunaid763:JUNAID12345@insightwirecluster.qz5cz.mongodb.net/Scraped-Articles-11?retryWrites=true&w=majority&appName=InsightWireCluster";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// ULTRA-DIRECT DEBUG ROUTE
app.get("/api/debug", async (req, res) => {
  try {
    // Check connection
    const dbState = mongoose.connection.readyState;

    // List all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    // Count in Articles collection
    const articlesCount = await mongoose.connection.db
      .collection("Articles")
      .countDocuments();

    // Count in categorizedarticles collection
    const categorizedCount = await mongoose.connection.db
      .collection("categorizedarticles")
      .countDocuments();

    // Get one raw document from categorizedarticles
    const oneCategorizedDoc = await mongoose.connection.db
      .collection("categorizedarticles")
      .findOne();

    // Get one raw document from Articles
    const oneDoc = await mongoose.connection.db
      .collection("Articles")
      .findOne();

    // Try different queries
    const findAll = await mongoose.connection.db
      .collection("Articles")
      .find({})
      .limit(1)
      .toArray();
    const findWithFilter = await mongoose.connection.db
      .collection("Articles")
      .find({})
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    res.json({
      success: true,
      dbConnected: dbState === 1,
      collections: collections.map((c) => c.name),
      articlesCount: articlesCount,
      categorizedCount: categorizedCount,
      oneDocumentKeys: oneDoc ? Object.keys(oneDoc) : null,
      oneDocumentTitle: oneDoc ? oneDoc.title : null,
      oneCategorizedKeys: oneCategorizedDoc
        ? Object.keys(oneCategorizedDoc)
        : null,
      oneCategorizedSample: oneCategorizedDoc || null,
      findAllCount: findAll.length,
      findWithFilterCount: findWithFilter.length,
      sampleDoc: findWithFilter[0] || findAll[0] || null,
    });
  } catch (error) {
    console.error("Debug route error:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// DIRECT ARTICLES ROUTE (bypassing controller cache issues)
app.get("/api/articles/direct", async (req, res) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await mongoose.connection.db
      .collection("Articles")
      .countDocuments();

    // Access the Articles collection directly with pagination
    const articles = await mongoose.connection.db
      .collection("Articles")
      .find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

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
    }));

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: mappedArticles,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Direct route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PERSPECTIVES API ENDPOINT
app.get("/api/perspectives", async (req, res) => {
  try {
    const articleId = req.query.articleId;

    if (!articleId) {
      return res.status(400).json({ error: "articleId parameter is required" });
    }

    // Check if perspectives collection exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const perspectivesExists = collections.some(
      (col) => col.name === "perspectives"
    );

    if (perspectivesExists) {
      // Try to find real perspectives for this article
      const perspectives = await mongoose.connection.db
        .collection("perspectives")
        .find({ articleId: articleId })
        .toArray();

      if (perspectives.length > 0) {
        return res.json({
          success: true,
          data: perspectives,
        });
      }
    }

    // Return mock perspectives if no real data found
    const mockPerspectives = [
      {
        _id: `mock_${articleId}_1`,
        articleId: articleId,
        perspective: "Liberal Perspective",
        summary:
          "This article can be viewed through a progressive lens, emphasizing social justice, equality, and the importance of government intervention to address systemic issues.",
        bias_score: 0.3,
        viewpoint: "left",
      },
      {
        _id: `mock_${articleId}_2`,
        articleId: articleId,
        perspective: "Conservative Perspective",
        summary:
          "From a conservative viewpoint, this article highlights the importance of traditional values, individual responsibility, and limited government intervention.",
        bias_score: 0.7,
        viewpoint: "right",
      },
      {
        _id: `mock_${articleId}_3`,
        articleId: articleId,
        perspective: "Centrist Perspective",
        summary:
          "A balanced analysis shows both sides of the issue, seeking common ground and practical solutions that consider multiple stakeholder perspectives.",
        bias_score: 0.5,
        viewpoint: "center",
      },
    ];

    res.json({
      success: true,
      data: mockPerspectives,
      note: "Mock data provided - no real perspectives found in database",
    });
  } catch (error) {
    console.error("Perspectives route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// CATEGORIES API ENDPOINT
app.get("/api/categories", async (req, res) => {
  try {
    // Get categorized articles from the database
    const categorizedArticles = await mongoose.connection.db
      .collection("categorizedarticles")
      .find({})
      .toArray();

    // Get all articles from main collection for bias mapping
    const allMainArticles = await mongoose.connection.db
      .collection("Articles")
      .find({})
      .toArray();

    // Create a map of article ID to bias from main collection
    const articleBiasMap = new Map();
    allMainArticles.forEach((article) => {
      if (article._id) {
        articleBiasMap.set(
          article._id.toString(),
          article.biasness || article.bias || "center"
        );
      }
    });

    // Process categorized articles - each document is a category with articles
    const categories = categorizedArticles.map((categoryDoc) => {
      // Extract articles from this category document
      const articles = categoryDoc.articles || [];

      // Calculate bias distribution from the articles using main Articles collection bias data
      const biasStats = { left: 0, center: 0, right: 0 };

      articles.forEach((article) => {
        // First try to get bias from the categorized article itself
        let bias = article.bias || article.biasness;

        // If no bias in categorized article, try to map from main Articles collection
        if (!bias && article._id) {
          bias = articleBiasMap.get(article._id.toString()) || "center";
        }

        // Default to center if still no bias found
        bias = bias || "center";

        if (bias === "left") biasStats.left++;
        else if (bias === "right") biasStats.right++;
        else biasStats.center++;
      });

      const totalArticles = articles.length;
      const biasPercentages = {
        left:
          totalArticles > 0
            ? Math.round((biasStats.left / totalArticles) * 100)
            : 0,
        center:
          totalArticles > 0
            ? Math.round((biasStats.center / totalArticles) * 100)
            : 0,
        right:
          totalArticles > 0
            ? Math.round((biasStats.right / totalArticles) * 100)
            : 0,
      };

      return {
        id: categoryDoc._id.toString(),
        title: categoryDoc.title || "Untitled Category",
        summary:
          categoryDoc.summary || `Category with ${totalArticles} articles`,
        image_url:
          categoryDoc.image_url ||
          categoryDoc.imageUrl ||
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500",
        articleCount: totalArticles,
        biasStats,
        biasPercentages,
        articles: articles.slice(0, 10), // Limit to first 10 for preview
      };
    });

    // Sort by article count (descending)
    categories.sort((a, b) => b.articleCount - a.articleCount);

    res.json({
      success: true,
      data: categories,
      totalCategories: categories.length,
      message:
        "Real categorized articles with proper bias mapping from main Articles collection",
    });
  } catch (error) {
    console.error("Categories route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// SINGLE CATEGORY DETAIL API ENDPOINT
app.get("/api/categories/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Get the specific category document by ID
    const categoryDoc = await mongoose.connection.db
      .collection("categorizedarticles")
      .findOne({ _id: new mongoose.Types.ObjectId(categoryId) });

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Map the category data
    const mappedCategory = {
      _id: categoryDoc._id,
      title: categoryDoc.title || "Untitled Category",
      summary: categoryDoc.summary || "No summary available",
      image_url: categoryDoc.image_url || null,
      Background: categoryDoc.Background || "Not",
      Analytics: categoryDoc.Analytics || [],
      articles: categoryDoc.articles || [],
      createdAt: categoryDoc.createdAt,
      updatedAt: categoryDoc.updatedAt,
    };

    res.json({
      success: true,
      data: mappedCategory,
    });
  } catch (error) {
    console.error("Category detail route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// CATEGORY ARTICLES API ENDPOINT
app.get("/api/categories/:categoryId/articles", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const biasFilter = req.query.bias; // 'left', 'center', 'right', or undefined for all
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Get the specific category document by ID
    const categoryDoc = await mongoose.connection.db
      .collection("categorizedarticles")
      .findOne({ _id: new mongoose.Types.ObjectId(categoryId) });

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Extract article IDs from the category
    const articleIds = (categoryDoc.articles || []).map((article) => {
      if (typeof article._id === "string") {
        return new mongoose.Types.ObjectId(article._id);
      }
      return article._id;
    });

    if (articleIds.length === 0) {
      return res.json({
        success: true,
        data: [],
        categoryName: categoryDoc.title || "Category",
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }

    // Build query for main Articles collection
    let query = { _id: { $in: articleIds } };

    // Add bias filter if specified
    if (biasFilter && biasFilter !== "all") {
      query.biasness = biasFilter;
    }

    // Get total count for this filtered query
    const totalCount = await mongoose.connection.db
      .collection("Articles")
      .countDocuments(query);

    // Get the actual articles from the main Articles collection with pagination
    const articles = await mongoose.connection.db
      .collection("Articles")
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Map to frontend format
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
    }));

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: mappedArticles,
      categoryName: categoryDoc.title || "Category",
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Category articles route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route for categorized articles
app.get("/api/debug/categorized-articles", async (req, res) => {
  try {
    const categorizedArticles = await mongoose.connection.db
      .collection("categorizedarticles")
      .find({})
      .limit(5)
      .toArray();

    const sampleData = categorizedArticles.map((doc) => ({
      _id: doc._id,
      title: doc.title,
      articlesCount: doc.articles ? doc.articles.length : 0,
      sampleArticles: doc.articles
        ? doc.articles.slice(0, 3).map((a) => ({
            _id: a._id,
            title: a.title,
            hasTitle: !!a.title,
            hasContent: !!a.content,
            keys: Object.keys(a),
          }))
        : [],
      hasImageUrl: !!doc.image_url,
      hasSummary: !!doc.summary,
      documentKeys: Object.keys(doc),
    }));

    res.json({
      success: true,
      totalFound: categorizedArticles.length,
      sampleData: sampleData,
    });
  } catch (error) {
    console.error("Debug categorized route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Use routes
app.use("/api", routes);

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Backend server is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
