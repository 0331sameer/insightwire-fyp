import React from "react";

const Analytics = ({ analytics }) => {
  if (!analytics || analytics.length === 0) {
    return null;
  }

  const getLikelihoodColor = (score) => {
    if (score >= 0.8) return "bg-red-100 text-red-800 border-red-200";
    if (score >= 0.6) return "bg-orange-100 text-orange-800 border-orange-200";
    if (score >= 0.4) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getLikelihoodLabel = (score) => {
    if (score >= 0.8) return "Very High";
    if (score >= 0.6) return "High";
    if (score >= 0.4) return "Medium";
    return "Low";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-10 mb-8 border border-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Predictive Analytics
        </h3>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          AI-powered predictions and insights based on current trends and
          patterns.
        </p>
      </div>

      <div className="space-y-8">
        {analytics.map((prediction, index) => (
          <div
            key={prediction.id || index}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px] hover:border-gray-300 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900 flex-1 mr-4 break-words">
                {prediction.title}
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border flex-shrink-0 ${getLikelihoodColor(
                  prediction.likelihoodScore
                )}`}
              >
                {getLikelihoodLabel(prediction.likelihoodScore)}
              </span>
            </div>

            {/* Likelihood Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-semibold text-gray-700">
                  Likelihood Score
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {Math.round(prediction.likelihoodScore)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ease-out shadow-sm ${
                    prediction.likelihoodScore >= 0.8
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : prediction.likelihoodScore >= 0.6
                      ? "bg-gradient-to-r from-orange-500 to-orange-600"
                      : prediction.likelihoodScore >= 0.4
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                  style={{
                    width: `${Math.min(
                      Math.max(prediction.likelihoodScore * 100, 0),
                      100
                    )}%`,
                    maxWidth: "100%",
                  }}
                ></div>
              </div>
            </div>

            {/* Summary */}
            <p className="text-gray-700 text-base leading-relaxed mb-6 break-words">
              {prediction.summary}
            </p>

            {/* Reasoning - Collapsible */}
            {prediction.reasoning && (
              <details className="group">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-base font-medium flex items-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span>View Detailed Reasoning</span>
                  <svg
                    className="w-5 h-5 ml-2 transform group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-gray-700 text-base leading-relaxed break-words">
                    {prediction.reasoning}
                  </p>
                </div>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
