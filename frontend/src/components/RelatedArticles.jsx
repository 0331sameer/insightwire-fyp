import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RelatedArticles = ({ articleId }) => {
  const [relatedData, setRelatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (articleId) {
      fetchRelatedArticles();
    }
  }, [articleId]);

  const fetchRelatedArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/articles/${articleId}/related`
      );
      const data = await response.json();

      if (response.ok) {
        setRelatedData(data);
      } else {
        throw new Error(data.message || "Failed to fetch related articles");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
        return bias?.charAt(0).toUpperCase() + bias?.slice(1) || "Unknown";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleArticleClick = (relatedArticle) => {
    navigate(`/news/${relatedArticle._id}`, {
      state: { article: relatedArticle },
    });
  };

  const handleCategoryClick = () => {
    // Navigate to category page - using the correct route format
    navigate(`/category/${relatedData.category_id}`);
  };

  if (loading) {
    return (
      <div className="mt-16 border-t border-gray-200 pt-12">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
          <span className="ml-3 text-gray-600">
            Loading related articles...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 border-t border-gray-200 pt-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <p className="text-red-700">
            Error loading related articles: {error}
          </p>
        </div>
      </div>
    );
  }

  if (!relatedData || relatedData.remaining_count === 0) {
    return (
      <div className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Related Articles
        </h2>
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {relatedData?.message || "No related articles found"}
          </h3>
          <p className="mt-1 text-gray-500">
            This article hasn't been categorized yet or has no related articles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-gray-200 pt-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related Articles
        </h2>

        {/* Category Card */}
        {relatedData.category_title && (
          <div
            onClick={handleCategoryClick}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] cursor-pointer border border-gray-100 mb-8"
          >
            <div className="flex items-center p-6">
              {/* Category Image */}
              <div className="flex-shrink-0 w-24 h-24 mr-6">
                <img
                  src={
                    relatedData.category_image_url ||
                    "/placeholder.svg?height=96&width=96"
                  }
                  alt={relatedData.category_title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Category Content */}
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-700 transition-colors">
                  Category: {relatedData.category_title}
                </h3>
                {relatedData.category_summary && (
                  <p className="text-gray-600 text-sm leading-relaxed mt-1 mb-3 line-clamp-2">
                    {relatedData.category_summary}
                  </p>
                )}

                {/* Article Count */}
                {relatedData.article_count && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {relatedData.article_count} articles
                    </span>
                  </div>
                )}

                {/* Bias Distribution */}
                {relatedData.bias_percentages && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Bias Distribution</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden mb-1">
                      <div
                        className="bg-red-500"
                        style={{
                          width: `${relatedData.bias_percentages.left}%`,
                        }}
                        title={`Left: ${relatedData.bias_percentages.left}%`}
                      ></div>
                      <div
                        className="bg-green-500"
                        style={{
                          width: `${relatedData.bias_percentages.center}%`,
                        }}
                        title={`Center: ${relatedData.bias_percentages.center}%`}
                      ></div>
                      <div
                        className="bg-blue-500"
                        style={{
                          width: `${relatedData.bias_percentages.right}%`,
                        }}
                        title={`Right: ${relatedData.bias_percentages.right}%`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-red-600">
                        {relatedData.bias_percentages.left}%
                      </span>
                      <span className="text-green-600">
                        {relatedData.bias_percentages.center}%
                      </span>
                      <span className="text-blue-600">
                        {relatedData.bias_percentages.right}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="h-1 w-20 bg-gray-600 rounded mb-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedData.remaining_articles.map((article) => (
          <div
            key={article._id}
            onClick={() => handleArticleClick(article)}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-4px] cursor-pointer border border-gray-100"
          >
            {article.image_url && (
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={
                    article.image_url || "/placeholder.svg?height=192&width=320"
                  }
                  alt={article.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-40"></div>
                <div className="absolute bottom-0 left-0 p-3 w-full">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getBiasColor(
                        article.bias
                      )}`}
                    >
                      {getBiasName(article.bias)}
                    </span>
                    <span className="text-xs text-white font-medium">
                      Score: {Number.parseFloat(article.score || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">
                  {article.publication}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(article.date)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                {article.title}
              </h3>

              {article.snippet && (
                <p className="text-gray-600 line-clamp-3 mb-3 text-sm leading-relaxed">
                  {article.snippet}
                </p>
              )}

              <div className="flex justify-end">
                <span className="inline-flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
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

      <div className="mt-6 text-center text-sm text-gray-500">
        Showing {relatedData.remaining_count} related article
        {relatedData.remaining_count !== 1 ? "s" : ""} from the same category
      </div>
    </div>
  );
};

export default RelatedArticles;
