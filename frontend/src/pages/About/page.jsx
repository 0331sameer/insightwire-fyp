"use client";

import { useState } from "react";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("about");

  // Team member data with image paths
  const teamMembers = [
    {
      name: "Muhammad Sameer",
      role: "Developer and Project Manager",
      image: "/images/team/sameer.jpg",
      skills: ["Frontend", "Model Training", "Scrapping"],
    },
    {
      name: "Umar Ihsan",
      role: "Developer and AI",
      image: "/images/team/umar.jpg",
      skills: ["RAG", "AI/ML", "NLP"],
    },
    {
      name: "Junaid",
      role: "Developer and DevOps",
      image: "/images/team/junaid.jpg",
      skills: ["Frontend", "Backend", "DevOps"],
    },
  ];

  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      title: "Categorized Articles",
      description: "Grouped by context using NLP for easy exploration",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Bias Detection",
      description: "Highlights political or tonal bias in news sources",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Confidence Scores",
      description: "Shows how confident the system is about its analysis",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-purple-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      title: "User Feedback",
      description: "Rate and comment on article quality",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About InsightWire
            </h1>
            <p className="text-xl text-gray-600">
              Bringing clarity to news through intelligent analysis
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              {[
                { id: "about", label: "About" },
                { id: "features", label: "Features" },
                { id: "team", label: "Our Team" },
                { id: "technology", label: "Technology" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10 transform transition-all duration-300 hover:shadow-lg">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  About InsightWire
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    InsightWire is a smart news analysis platform built to
                    provide readers with a deeper understanding of current
                    events. Unlike typical aggregators, InsightWire uses modern
                    Natural Language Processing (NLP) techniques to group
                    similar articles, detect potential media bias, and offer a
                    structured, insightful view of the news.
                  </p>
                  <p>
                    Whether you're keeping up with global affairs or analyzing
                    trends, InsightWire helps you see the bigger picture behind
                    the headlines.
                  </p>
                  <div className="relative mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="absolute top-0 left-0 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      Our Mission
                    </div>
                    <p className="text-blue-800">
                      To empower readers with comprehensive, balanced news
                      coverage that highlights different perspectives and
                      reduces the impact of media bias.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-6 rounded-lg border border-gray-100 transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-md"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4">{feature.icon}</div>
                        <h3 className="text-lg font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Our Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {teamMembers.map((person, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-xl border border-gray-100 transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-md"
                    >
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                        <img
                          src={
                            person.image ||
                            "/placeholder.svg?height=128&width=128"
                          }
                          alt={person.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "/placeholder.svg?height=128&width=128";
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {person.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{person.role}</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {person.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Technology Tab */}
          {activeTab === "technology" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Our Technology
                </h2>
                <div className="space-y-6 text-gray-700">
                  <p>
                    InsightWire leverages cutting-edge technologies to deliver
                    accurate news analysis:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                        Natural Language Processing
                      </h3>
                      <p className="text-gray-600 text-sm">
                        We use advanced NLP models to understand article
                        content, context, and sentiment.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Bias Detection Algorithms
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Our proprietary algorithms identify political leanings
                        and potential bias in reporting.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                        Topic Clustering
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Similar articles are grouped together using semantic
                        similarity measures.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Confidence Scoring
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Each analysis includes a confidence score to ensure
                        transparency.
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Tech Stack
                    </h3>
                    <p className="text-gray-700">
                      Our platform is built with React, Next.js, and Tailwind
                      CSS for the frontend, with a robust backend powered by
                      Node.js and MongoDB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
