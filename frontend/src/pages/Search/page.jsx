import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [biasFilter, setBiasFilter] = useState("all");

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const token = Cookies.get("token");

      const response = await fetch(
        `/api/categorized-articles/search?q=${encodeURIComponent(
          query
        )}&sort=${sortBy}&bias=${biasFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search articles");
      }

      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      performSearch(searchQuery.trim());
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Categories
            </h1>
            <p className="text-gray-600">
              Find categorized articles across different topics and perspectives
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories by title, summary, or keywords..."
                className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-6 bg-gray-900 text-white rounded-r-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          {hasSearched && (
            <div className="flex flex-wrap gap-4 justify-center mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="articles">Article Count</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Bias:</label>
                <select
                  value={biasFilter}
                  onChange={(e) => setBiasFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                >
                  <option value="all">All Bias</option>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !loading && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {searchResults.length > 0
                ? `Found ${searchResults.length} result${
                    searchResults.length !== 1 ? "s" : ""
                  } for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </h2>
          </div>
        )}

        {/* Results Grid */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300"
              >
                {/* Category Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-t-xl overflow-hidden">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
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
                    </div>
                  )}
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {category.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {category.summary}
                  </p>

                  {/* Article Count */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {category.articleCount || category.articles?.length || 0}{" "}
                      articles
                    </span>

                    {/* Date */}
                    <span className="text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Bias Distribution */}
                  {category.biasDistribution && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Bias Distribution:
                      </div>
                      <div className="flex space-x-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        {category.biasDistribution.left > 0 && (
                          <div
                            className="bg-red-400 h-full"
                            style={{
                              width: `${category.biasDistribution.leftPercentage}%`,
                            }}
                          ></div>
                        )}
                        {category.biasDistribution.center > 0 && (
                          <div
                            className="bg-green-400 h-full"
                            style={{
                              width: `${category.biasDistribution.centerPercentage}%`,
                            }}
                          ></div>
                        )}
                        {category.biasDistribution.right > 0 && (
                          <div
                            className="bg-blue-400 h-full"
                            style={{
                              width: `${category.biasDistribution.rightPercentage}%`,
                            }}
                          ></div>
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>
                          Left: {category.biasDistribution.leftPercentage}%
                        </span>
                        <span>
                          Center: {category.biasDistribution.centerPercentage}%
                        </span>
                        <span>
                          Right: {category.biasDistribution.rightPercentage}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {hasSearched && !loading && searchResults.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchParams({});
                setHasSearched(false);
                setSearchResults([]);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Welcome State */}
        {!hasSearched && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start searching
            </h3>
            <p className="text-gray-600">
              Enter keywords to search through categorized articles and find
              relevant topics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
