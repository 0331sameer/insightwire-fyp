import React from "react";
import CategoryFlowchart from "./CategoryFlowchart";
import ForceDirectedGraph from "./ForceDirectedGraph";
import Analytics from "./Analytics";

const TestCategoryFeatures = () => {
  // Sample data for testing
  const sampleCategories = [
    { id: "1", title: "Politics" },
    { id: "2", title: "US Politics" },
    { id: "3", title: "Presidential Elections" },
  ];

  const sampleGraphData = {
    nodes: [
      { id: "1", title: "Politics", color: "#ef4444" },
      { id: "2", title: "US Politics", color: "#f59e0b" },
      { id: "3", title: "Presidential Elections", color: "#3b82f6" },
    ],
    links: [
      { source: "3", target: "2" },
      { source: "2", target: "1" },
    ],
  };

  const sampleAnalytics = [
    {
      id: "1",
      title: "Election Outcome Prediction",
      likelihoodScore: 0.85,
      summary:
        "Based on current polling data and historical trends, there is a high likelihood of significant voter turnout in swing states.",
      reasoning:
        "Analysis of voter registration data, early voting patterns, and demographic shifts indicates increased political engagement across key battleground states.",
    },
    {
      id: "2",
      title: "Media Coverage Impact",
      likelihoodScore: 0.65,
      summary:
        "Social media influence on voter perception is expected to play a crucial role in the upcoming election cycle.",
      reasoning:
        "Historical correlation between social media engagement metrics and actual voting behavior suggests a strong predictive relationship.",
    },
    {
      id: "3",
      title: "Economic Policy Effects",
      likelihoodScore: 0.45,
      summary:
        "Current economic indicators suggest moderate impact on voter preferences regarding fiscal policy positions.",
      reasoning:
        "Economic sentiment surveys and employment data show mixed signals that may not strongly influence single-issue voting patterns.",
    },
  ];

  const handleNodeClick = (node) => {
    console.log("Node clicked:", node);
    alert(`Clicked on: ${node.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Category Features Test Page
        </h1>

        {/* Analytics Test */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Analytics Component
          </h2>
          <Analytics analytics={sampleAnalytics} />
        </div>

        {/* Flowchart Test */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Category Flowchart
          </h2>
          <CategoryFlowchart categories={sampleCategories} />
        </div>

        {/* Force Directed Graph Test */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Force Directed Graph
          </h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex justify-center">
              <ForceDirectedGraph
                nodes={sampleGraphData.nodes}
                links={sampleGraphData.links}
                width={600}
                height={400}
                onNodeClick={handleNodeClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCategoryFeatures;
