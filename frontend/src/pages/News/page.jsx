"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  // Categories for the navigation
  const categories = [
    { id: "all", name: "All News" },
    { id: "politics", name: "Politics" },
    { id: "business", name: "Business" },
    { id: "technology", name: "Technology" },
    { id: "science", name: "Science" },
    { id: "health", name: "Health" },
    { id: "entertainment", name: "Entertainment" },
  ];

  useEffect(() => {
    fetchArticles();

    // Add scroll event listener for parallax effect
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchArticles = async (page = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setCurrentPage(1);
    }
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/articles/direct?page=${page}`
      );

      if (response.ok) {
        const data = await response.json();

        let articleArray = [];
        if (data.data && Array.isArray(data.data)) {
          articleArray = data.data;
        } else if (Array.isArray(data)) {
          articleArray = data;
        } else if (data.articles && Array.isArray(data.articles)) {
          articleArray = data.articles;
        }

        const mappedArticles = articleArray.map((article) => ({
          ...article,
          bias: article.bias || article.biasness || "center",
        }));

        if (data.pagination) {
          setCurrentPage(data.pagination.currentPage);
          setTotalPages(data.pagination.totalPages);
          setHasMoreArticles(
            data.pagination.currentPage < data.pagination.totalPages
          );
        } else {
          setHasMoreArticles(false);
        }

        if (append) {
          setArticles((prev) => [...prev, ...mappedArticles]);
        } else {
          setArticles(mappedArticles);
        }
      } else {
        throw new Error(`Failed to fetch articles: ${response.status}`);
      }
    } catch (error) {
      setError(`Failed to load articles: ${error.message}`);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreArticles = async () => {
    if (!hasMoreArticles || loadingMore) return;
    const nextPage = currentPage + 1;
    await fetchArticles(nextPage, true);
  };

  const getBiasColor = (bias) => {
    switch (bias) {
      case "left":
        return "bg-red-100 text-red-800 border-red-200";
      case "right":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "center":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBiasName = (bias) => {
    switch (bias) {
      case "left":
        return "Liberal";
      case "right":
        return "Conservative";
      case "center":
        return "Neutral";
      default:
        return bias.charAt(0).toUpperCase() + bias.slice(1);
    }
  };

  const handleArticleClick = (article) => {
    navigate(`/news/${article._id}`, { state: { article } });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get featured article (first article or null)
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  // Get remaining articles (skip the first one if it exists)
  const remainingArticles = articles.length > 0 ? articles.slice(1) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading latest news...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Article */}
      {featuredArticle && (
        <div
          id="hero-section"
          className="relative bg-cover bg-center h-[500px] flex items-end"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8)), url(${
              featuredArticle.image_url ||
              "/placeholder.svg?height=500&width=1200"
            })`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl transform translate-y-0 hover:translate-y-[-5px] transition-transform duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBiasColor(
                    featuredArticle.bias
                  )}`}
                >
                  {getBiasName(featuredArticle.bias)}
                </span>
                <span className="text-sm text-white font-medium">
                  {featuredArticle.publication}
                </span>
                <span className="text-sm text-white">
                  {formatDate(featuredArticle.date)}
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight cursor-pointer hover:underline"
                onClick={() => handleArticleClick(featuredArticle)}
              >
                {featuredArticle.title}
              </h2>
              <button
                onClick={() => handleArticleClick(featuredArticle)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors transform hover:translate-y-[-2px] hover:shadow-lg"
              >
                Read Full Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Latest News
            </h2>
            <div className="mt-1 h-1 w-20 bg-blue-600 rounded"></div>
          </div>
          <button
            onClick={() => fetchArticles()}
            className="px-5 py-2.5 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center space-x-2 shadow-sm transform hover:translate-y-[-2px] hover:shadow-md"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            <span>{loading ? "Loading..." : "Refresh"}</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {remainingArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingArticles.map((article) => (
              <div
                key={article._id}
                onClick={() => handleArticleClick(article)}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-8px] cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={
                      article.image_url ||
                      "/placeholder.svg?height=224&width=400"
                    }
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${getBiasColor(
                          article.bias
                        )}`}
                      >
                        {getBiasName(article.bias)}
                      </span>
                      <span className="text-xs text-white font-medium">
                        Score:{" "}
                        {Number.parseFloat(article.score || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 font-medium">
                      {article.publication}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(article.date)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  {article.description && (
                    <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
                      {article.description}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                      Read more
                      <svg
                        className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No articles found
              </h3>
              <p className="mt-1 text-gray-500">
                Try refreshing the page or check back later.
              </p>
            </div>
          )
        )}

        {/* Load More Button */}
        {hasMoreArticles && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMoreArticles}
              disabled={loadingMore}
              className="px-8 py-3 bg-white border border-gray-300 rounded-md text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-2 transform hover:translate-y-[-2px] hover:shadow-md"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span>Loading More...</span>
                </>
              ) : (
                <>
                  <span>Load More Articles</span>
                  <span className="text-sm text-gray-500">
                    ({currentPage}/{totalPages})
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsPage;
