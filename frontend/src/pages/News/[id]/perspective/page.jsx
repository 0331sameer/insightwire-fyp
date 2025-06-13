import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PerspectivePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [perspectives, setPerspectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticleAndPerspectives();
  }, [id]);

  const fetchArticleAndPerspectives = async () => {
    try {
      setLoading(true);

      // Fetch article details
      const articleResponse = await fetch(
        `http://localhost:5000/api/articles/${id}`
      );
      if (articleResponse.ok) {
        const articleData = await articleResponse.json();
        setArticle(articleData);
      }

      // Fetch perspectives
      const perspectivesResponse = await fetch(
        `http://localhost:5000/api/perspectives?articleId=${id}`
      );

      if (perspectivesResponse.ok) {
        const data = await perspectivesResponse.json();
        setPerspectives(data.data || []);
      } else {
        // If no perspectives API, show mock data for demo
        setPerspectives([
          {
            _id: "mock1",
            perspective: "Liberal",
            summary:
              "This article presents a progressive viewpoint focusing on social justice and equality.",
            bias_score: 0.3,
          },
          {
            _id: "mock2",
            perspective: "Conservative",
            summary:
              "This article emphasizes traditional values and individual responsibility.",
            bias_score: 0.7,
          },
          {
            _id: "mock3",
            perspective: "Centrist",
            summary:
              "This article provides a balanced view considering multiple perspectives.",
            bias_score: 0.5,
          },
        ]);
      }
    } catch (error) {
      setError(error.message);
      // Set mock data even on error
      setPerspectives([
        {
          _id: "mock1",
          perspective: "Liberal",
          summary:
            "This article presents a progressive viewpoint focusing on social justice and equality.",
          bias_score: 0.3,
        },
        {
          _id: "mock2",
          perspective: "Conservative",
          summary:
            "This article emphasizes traditional values and individual responsibility.",
          bias_score: 0.7,
        },
        {
          _id: "mock3",
          perspective: "Centrist",
          summary:
            "This article provides a balanced view considering multiple perspectives.",
          bias_score: 0.5,
        },
      ]);
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
        return bias.charAt(0).toUpperCase() + bias.slice(1);
    }
  };

  const getPerspectiveColor = (perspective) => {
    switch (perspective.toLowerCase()) {
      case "liberal":
        return "border-l-red-500";
      case "conservative":
        return "border-l-blue-500";
      case "centrist":
        return "border-l-green-500";
      default:
        return "border-l-purple-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading perspectives...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/news/${id}`)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:translate-x-[-2px] transition-transform"
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
          Back to Article
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Article Perspectives
                </h2>
              </div>

              {article && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    Original Article
                  </h3>
                  <p className="text-xl font-semibold text-gray-800 mb-3">
                    {article.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-gray-600">{article.publication}</span>
                    <span className="text-gray-400">•</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getBiasColor(
                        article.bias || article.biasness
                      )}`}
                    >
                      {getBiasName(
                        article.bias || article.biasness || "center"
                      )}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-blue-600">
                      Score: {parseFloat(article.score || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Real-time perspectives not available. Showing sample
                        perspectives below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {perspectives.length > 0 ? (
                <div className="space-y-6">
                  {perspectives.map((perspective, index) => (
                    <div
                      key={perspective._id || index}
                      className={`border-l-4 ${getPerspectiveColor(
                        perspective.perspective
                      )} bg-white rounded-r-xl shadow-sm hover:shadow-md transition-shadow p-6 transform hover:translate-y-[-2px] transition-transform`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          <span
                            className={`inline-block w-3 h-3 rounded-full mr-2 ${
                              perspective.perspective.toLowerCase() ===
                              "liberal"
                                ? "bg-red-500"
                                : perspective.perspective.toLowerCase() ===
                                  "conservative"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          ></span>
                          {perspective.perspective ||
                            `Perspective ${index + 1}`}
                        </h4>
                        {perspective.bias_score !== undefined && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            Bias Score:{" "}
                            <span className="font-bold">
                              {perspective.bias_score.toFixed(1)}
                            </span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {perspective.summary ||
                          perspective.content ||
                          "No summary available"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No perspectives found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    No alternative perspectives are available for this article.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerspectivePage;
