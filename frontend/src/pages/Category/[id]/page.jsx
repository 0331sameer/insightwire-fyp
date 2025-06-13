"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CategoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [biasFilter, setBiasFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    liberal: 0,
    conservative: 0,
    neutral: 0,
  });
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchCategoryDetails();
    fetchCategoryArticles();
    checkSavedStatus();
    fetchFeedback();
    // Get user from cookies
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch {}
    }
  }, [id, biasFilter, currentPage]);

  const getAuthHeaders = () => {
    const token = Cookies.get("token");
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (token === "mock-jwt-token" || token === "mock-google-jwt-token") {
      if (user && user._id) headers["x-mock-user-id"] = user._id;
    }
    return headers;
  };

  const checkSavedStatus = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const response = await fetch(
        `http://localhost:5000/api/saved-categories/check/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.isSaved);
      }
    } catch {
      // Silently handle error - saved status check is not critical
    }
  };

  const handleSaveCategory = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please login to save categories");
        return;
      }

      setSaveLoading(true);

      if (isSaved) {
        // Unsave category
        const response = await fetch(
          `http://localhost:5000/api/saved-categories/${id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );

        if (response.ok) {
          setIsSaved(false);
          alert("Category removed from saved items");
        } else {
          throw new Error("Failed to unsave category");
        }
      } else {
        // Save category
        const response = await fetch(
          "http://localhost:5000/api/saved-categories",
          {
            method: "POST",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryId: id,
              categoryTitle: categoryDetails?.title || "Unknown Category",
              categoryImageUrl: categoryDetails?.image_url || null,
            }),
          }
        );

        if (response.ok) {
          setIsSaved(true);
          alert("Category saved successfully!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save category");
        }
      }
    } catch (error) {
      alert(error.message || "An error occurred");
    } finally {
      setSaveLoading(false);
    }
  };

  const fetchCategoryDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      if (response.ok) {
        const data = await response.json();
        const categoryData = data.data.find((cat) => cat.id === id);
        if (categoryData) {
          setCategoryDetails(categoryData);
          setStats({
            total: categoryData.articleCount,
            liberal: Math.round(
              (categoryData.biasPercentages.left / 100) *
                categoryData.articleCount
            ),
            conservative: Math.round(
              (categoryData.biasPercentages.right / 100) *
                categoryData.articleCount
            ),
            neutral: Math.round(
              (categoryData.biasPercentages.center / 100) *
                categoryData.articleCount
            ),
          });
        }
      }
    } catch {
      // Silently handle error - category details will show default state
    }
  };

  const fetchCategoryArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:5000/api/categories/${id}/articles?bias=${biasFilter}&page=${currentPage}`
      );

      if (response.ok) {
        const data = await response.json();
        setArticles(data.data || []);

        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setHasNextPage(data.pagination.hasNextPage);
        }
      } else {
        throw new Error("Failed to fetch category articles");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    setFeedbackLoading(true);
    setFeedbackError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${id}`);
      const data = await res.json();
      if (data.success) {
        setFeedbackList(data.data);
      } else {
        setFeedbackError(data.error || "Failed to load comments");
      }
    } catch {
      setFeedbackError("Failed to load comments");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    setFeedbackError(null);
    try {
      const token = Cookies.get("token");
      if (!token || !user) {
        setFeedbackError("You must be logged in to comment.");
        setSubmitting(false);
        return;
      }
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          categoryId: id,
          comment,
          userName: user.userName || user.email || "User",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComment("");
        fetchFeedback();
      } else {
        setFeedbackError(data.error || "Failed to submit comment");
      }
    } catch {
      setFeedbackError("Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBiasFilterChange = (newFilter) => {
    setBiasFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const BiasChart = () => {
    if (!categoryDetails) return null;

    const { biasPercentages } = categoryDetails;

    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Bias Distribution
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-20 text-sm font-medium text-gray-700">
              Liberal
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-4">
                <div
                  className="bg-red-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${biasPercentages.left}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm font-semibold text-red-600 text-right">
              {biasPercentages.left}%
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-20 text-sm font-medium text-gray-700">
              Neutral
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${biasPercentages.center}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm font-semibold text-green-600 text-right">
              {biasPercentages.center}%
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-20 text-sm font-medium text-gray-700">
              Conservative
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${biasPercentages.right}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm font-semibold text-blue-600 text-right">
              {biasPercentages.right}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Category Image */}
      {categoryDetails && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={
              categoryDetails.image_url ||
              "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200"
            }
            alt={categoryDetails.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>

          {/* Save Button - Top Right */}
          <button
            onClick={handleSaveCategory}
            disabled={saveLoading}
            title={isSaved ? "Remove from saved" : "Save category"}
            className={`absolute top-6 right-6 p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-xl z-50 ${
              isSaved
                ? "bg-white hover:bg-gray-50 text-red-500 hover:text-red-600 shadow-red-200"
                : "bg-white/95 hover:bg-white text-gray-600 hover:text-red-500"
            } ${
              saveLoading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:shadow-2xl"
            }`}
          >
            {saveLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
            ) : (
              <svg
                className="w-6 h-6 transition-colors duration-200"
                fill={isSaved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={isSaved ? 0 : 2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>

          <div className="absolute inset-0 flex items-center z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                  {categoryDetails.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Articles"
              value={stats.total}
              color="bg-blue-100"
              icon={
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Liberal Articles"
              value={stats.liberal}
              color="bg-red-100"
              icon={
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              }
            />

            <StatCard
              title="Neutral Articles"
              value={stats.neutral}
              color="bg-green-100"
              icon={
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Conservative Articles"
              value={stats.conservative}
              color="bg-blue-100"
              icon={
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              }
            />
          </div>

          {/* Category Summary Section */}
          {categoryDetails && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Category
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {categoryDetails.summary ||
                    "Explore comprehensive coverage of this topic from multiple perspectives and sources. This category provides diverse viewpoints to help you understand the full scope of the story."}
                </p>
                <div className="flex items-center justify-center space-x-8 mt-6 text-gray-500">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{categoryDetails.articleCount} Articles</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Multiple Perspectives</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <BiasChart />

            {/* Publication Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Quick Facts
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">
                    Category Focus
                  </span>
                  <span className="text-blue-600 font-semibold">
                    News Analysis
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">
                    Most Common Bias
                  </span>
                  <span
                    className={`font-semibold ${
                      categoryDetails?.biasPercentages.left >
                        categoryDetails?.biasPercentages.center &&
                      categoryDetails?.biasPercentages.left >
                        categoryDetails?.biasPercentages.right
                        ? "text-red-600"
                        : categoryDetails?.biasPercentages.right >
                          categoryDetails?.biasPercentages.center
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {categoryDetails?.biasPercentages.left >
                      categoryDetails?.biasPercentages.center &&
                    categoryDetails?.biasPercentages.left >
                      categoryDetails?.biasPercentages.right
                      ? "Liberal"
                      : categoryDetails?.biasPercentages.right >
                        categoryDetails?.biasPercentages.center
                      ? "Conservative"
                      : "Neutral"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">
                    Content Variety
                  </span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Browse Articles
              </h2>
              <p className="text-gray-600 mb-6">
                Filter articles by bias perspective to explore different
                viewpoints on this topic.
              </p>

              {/* Bias Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    key: "all",
                    label: "All Articles",
                    color: "bg-gray-100 text-gray-800",
                    count: stats.total,
                  },
                  {
                    key: "left",
                    label: "Liberal",
                    color: "bg-red-100 text-red-800",
                    count: stats.liberal,
                  },
                  {
                    key: "center",
                    label: "Neutral",
                    color: "bg-green-100 text-green-800",
                    count: stats.neutral,
                  },
                  {
                    key: "right",
                    label: "Conservative",
                    color: "bg-blue-100 text-blue-800",
                    count: stats.conservative,
                  },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => handleBiasFilterChange(filter.key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                      biasFilter === filter.key
                        ? `${filter.color} shadow-sm transform translate-y-[-2px]`
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

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
          {articles.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-5 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:translate-y-[-2px] hover:shadow-md"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>

                  <div className="px-4 py-2 bg-gray-100 rounded-md">
                    <span className="text-gray-700 font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="px-5 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:translate-y-[-2px] hover:shadow-md"
                  >
                    Next
                    <svg
                      className="w-5 h-5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
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
                {error
                  ? "Failed to load articles."
                  : "No articles found for this filter."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- FEEDBACK/COMMENTS SECTION --- */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="w-full bg-white rounded-xl shadow-md p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments & Feedback
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleFeedbackSubmit} className="mb-8">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-2"
                rows={3}
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                disabled={submitting}
                required
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {comment.length}/1000
                </span>
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 text-gray-600 text-center">
              <span>You must be logged in to post a comment.</span>
            </div>
          )}

          {/* Feedback List */}
          {feedbackLoading ? (
            <div className="text-center text-gray-500 py-8">
              Loading comments...
            </div>
          ) : feedbackError ? (
            <div className="text-center text-red-500 py-8">{feedbackError}</div>
          ) : feedbackList.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <ul className="space-y-6">
              {feedbackList.map((fb) => (
                <li key={fb._id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-gray-800 mr-2">
                      {fb.userName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(fb.createdAt)}
                    </span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-line">
                    {fb.comment}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage;
