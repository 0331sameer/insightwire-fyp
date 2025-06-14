import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryFlowchart = ({ categories }) => {
  const navigate = useNavigate();

  if (!categories || categories.length === 0) {
    return null;
  }

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Category Hierarchy
        </h3>
        <p className="text-gray-600">
          Navigate through the category structure from current to parent
          categories
        </p>
      </div>

      {/* Vertical Hierarchy */}
      <div className="flex flex-col items-center space-y-4 max-w-md mx-auto">
        {categories.map((category, index) => (
          <React.Fragment key={category._id || category.id}>
            {/* Category Card */}
            <div
              className={`w-full group transition-all duration-300 ${
                index === 0
                  ? "transform scale-105"
                  : "hover:transform hover:scale-102"
              }`}
            >
              <button
                onClick={() => handleCategoryClick(category._id || category.id)}
                className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 ${
                  index === 0
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-2 border-blue-500"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-purple-50 hover:to-purple-100 hover:text-purple-800 border-2 border-gray-300 hover:border-purple-300"
                }`}
                aria-label={`Navigate to ${category.title} category`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0 ? "bg-white" : "bg-purple-500"
                      }`}
                    ></div>
                    <span className="text-left font-medium">
                      {category.title}
                    </span>
                  </div>
                  {index === 0 && (
                    <div className="flex items-center space-x-1 text-white/80">
                      <span className="text-xs font-medium">Current</span>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {index > 0 && (
                    <div className="flex items-center space-x-1 text-gray-600">
                      <span className="text-xs font-medium">
                        {index === 1 ? "Parent" : `Level ${index}`}
                      </span>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Level indicator */}
                <div className="mt-2 text-left">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      index === 0
                        ? "bg-white/20 text-white"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {index === 0
                      ? "Current Category"
                      : index === 1
                      ? "Parent Category"
                      : `Parent Level ${index}`}
                  </span>
                </div>
              </button>
            </div>

            {/* Arrow pointing down */}
            {index < categories.length - 1 && (
              <div className="flex flex-col items-center text-gray-400">
                <svg
                  className="w-6 h-6 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <div className="w-px h-4 bg-gray-300"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Navigation hint */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Current category at top, parent categories below • Click to navigate
        </p>
      </div>
    </div>
  );
};

export default CategoryFlowchart;
