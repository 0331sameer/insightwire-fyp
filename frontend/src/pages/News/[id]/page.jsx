import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article || null);
  const [loading, setLoading] = useState(!article);
  const [error, setError] = useState(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (!article) {
      fetchArticle();
    }
  }, [id, article]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/articles/${id}`);

      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else {
        throw new Error("Article not found");
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
        return bias.charAt(0).toUpperCase() + bias.slice(1);
    }
  };

  const readArticle = () => {
    if (!article) return;

    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const textToRead = `${article.title}. ${article.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
  };

  const handleShowPerspectives = () => {
    navigate(`/news/${id}/perspective`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            {error || "Article not found"}
          </h2>
          <button
            onClick={() => navigate("/news")}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors transform hover:translate-y-[-2px] hover:shadow-lg"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/news")}
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
          Back to News
        </button>

        <article className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto transform hover:shadow-lg transition-all duration-300">
          {article.image_url && (
            <div className="relative h-80 w-full">
              <img
                src={article.image_url || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getBiasColor(
                      article.bias || article.biasness
                    )}`}
                  >
                    {getBiasName(article.bias || article.biasness || "center")}
                  </span>
                  <span className="text-white font-medium">
                    {article.publication}
                  </span>
                  <span className="text-gray-200">
                    {formatDate(article.date)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600">
                  {formatDate(article.date)}
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="text-gray-600">{article.publication}</span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
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
                <span className="text-blue-600 font-medium">
                  Score: {parseFloat(article.score || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
              {article.content ? (
                <div className="whitespace-pre-wrap">{article.content}</div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800">
                    Full content not available. Click the link below to read the
                    full article.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={readArticle}
                  className={`flex items-center px-4 py-2 rounded-md text-white font-medium transition-all transform hover:translate-y-[-2px] hover:shadow-md ${
                    isReading
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isReading ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"
                      />
                    )}
                  </svg>
                  {isReading ? "Stop Reading" : "Read Article"}
                </button>

                <button
                  onClick={handleShowPerspectives}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all transform hover:translate-y-[-2px] hover:shadow-md font-medium"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Show Perspectives
                </button>
              </div>

              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium group"
                >
                  Read Original
                  <svg
                    className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticlePage;
