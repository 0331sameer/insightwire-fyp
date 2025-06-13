import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("saved");
  const [savedCategories, setSavedCategories] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Change password states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (activeTab === "saved") fetchSavedCategories();
    if (activeTab === "feedback") fetchUserFeedback();
    // eslint-disable-next-line
  }, [activeTab]);

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

  const fetchSavedCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/saved-categories", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSavedCategories(data.data);
      } else {
        setError(data.error || "Failed to load saved categories");
      }
    } catch (err) {
      setError("Failed to load saved categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/feedback/user/all", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackList(data.data);
      } else {
        setError(data.error || "Failed to load feedback");
      }
    } catch (err) {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setPasswordSuccess(true);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (err) {
      setPasswordError("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone and will remove all your saved categories and feedback."
      )
    )
      return;

    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(false);

    try {
      const res = await fetch("http://localhost:5000/api/user", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setDeleteSuccess(true);
        Cookies.remove("token");
        Cookies.remove("user");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setDeleteError(data.error || "Failed to delete account");
      }
    } catch (err) {
      setDeleteError("Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleUnsaveCategory = async (categoryId, e) => {
    e.stopPropagation();

    if (!window.confirm("Remove this category from your saved items?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/saved-categories/${categoryId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (res.ok) {
        setSavedCategories((prev) =>
          prev.filter((cat) => cat.categoryId !== categoryId)
        );
      } else {
        alert("Failed to remove category");
      }
    } catch (err) {
      alert("Failed to remove category");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isGoogleUser = user?.authType === "google";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-white mb-4 mx-auto">
                  {user?.userName?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">
                  {user?.userName || user?.email?.split("@")[0]}
                </h1>
                <p className="text-gray-600 text-sm mb-3">{user?.email}</p>
                <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  {isGoogleUser ? (
                    <>
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google Account
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Local Account
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  ID: {user?._id}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:w-2/3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                {[
                  { id: "saved", label: "Saved Categories", icon: "❤️" },
                  { id: "feedback", label: "My Feedback", icon: "💬" },
                  { id: "settings", label: "Settings", icon: "⚙️" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "text-gray-900 border-b-2 border-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Saved Categories Tab */}
                {activeTab === "saved" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Saved Categories
                      </h2>
                      <div className="text-sm text-gray-500">
                        {savedCategories.length}{" "}
                        {savedCategories.length === 1
                          ? "category"
                          : "categories"}
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <div className="text-red-600 mb-4">{error}</div>
                        <button
                          onClick={fetchSavedCategories}
                          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : savedCategories.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No saved categories yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Start exploring categories and save the ones you find
                          interesting!
                        </p>
                        <button
                          onClick={() => navigate("/category")}
                          className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium"
                        >
                          Browse Categories
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {savedCategories.map((item) => (
                          <div
                            key={item._id}
                            className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleCategoryClick(item.categoryId)}
                          >
                            <div className="flex items-start space-x-4">
                              {item.categoryImageUrl && (
                                <img
                                  src={item.categoryImageUrl}
                                  alt=""
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition">
                                  {item.categoryTitle}
                                </h3>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                                  <span>
                                    Saved on {formatDate(item.savedAt)}
                                  </span>
                                  <span>ID: {item.categoryId}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <button
                                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCategoryClick(item.categoryId);
                                    }}
                                  >
                                    View Category →
                                  </button>
                                  <button
                                    onClick={(e) =>
                                      handleUnsaveCategory(item.categoryId, e)
                                    }
                                    className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback Tab */}
                {activeTab === "feedback" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        My Feedback
                      </h2>
                      <div className="text-sm text-gray-500">
                        {feedbackList.length}{" "}
                        {feedbackList.length === 1 ? "comment" : "comments"}
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <div className="text-red-600 mb-4">{error}</div>
                        <button
                          onClick={fetchUserFeedback}
                          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : feedbackList.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No feedback yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Share your thoughts on categories to help others
                          discover great content!
                        </p>
                        <button
                          onClick={() => navigate("/category")}
                          className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium"
                        >
                          Browse Categories
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {feedbackList.map((fb) => (
                          <div
                            key={fb._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-sm font-medium text-white">
                                  {fb.userName?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {fb.userName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatDate(fb.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  navigate(`/category/${fb.categoryId}`)
                                }
                                className="text-gray-600 hover:text-gray-900 text-sm font-medium px-2 py-1 rounded hover:bg-gray-50 transition"
                              >
                                View Category
                              </button>
                            </div>
                            <div className="text-gray-700 mb-2 leading-relaxed">
                              {fb.comment}
                            </div>
                            <div className="text-xs text-gray-400">
                              Category ID: {fb.categoryId}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Account Settings
                    </h2>

                    {/* Change Password Section */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Change Password
                      </h3>

                      {isGoogleUser ? (
                        <div className="text-gray-600">
                          <p className="mb-3">
                            You're signed in with Google. To change your
                            password, please visit your Google Account settings.
                          </p>
                          <a
                            href="https://myaccount.google.com/security"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium"
                          >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                            Google Account Settings
                          </a>
                        </div>
                      ) : (
                        <form
                          onSubmit={handleChangePassword}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  currentPassword: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                              required
                              minLength={6}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                              required
                              minLength={6}
                            />
                          </div>

                          {passwordError && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                              {passwordError}
                            </div>
                          )}

                          {passwordSuccess && (
                            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                              ✅ Password changed successfully!
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={passwordLoading}
                            className="px-4 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {passwordLoading
                              ? "Changing..."
                              : "Change Password"}
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Delete Account Section */}
                    <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                      <h3 className="text-lg font-medium mb-4 text-red-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Danger Zone
                      </h3>
                      <div className="text-gray-700 mb-4">
                        <p className="mb-2">
                          <strong>This action cannot be undone.</strong>
                        </p>
                        <p className="text-sm">
                          Deleting your account will permanently remove:
                        </p>
                        <ul className="text-sm mt-2 ml-4 space-y-1">
                          <li>• Your profile and account information</li>
                          <li>
                            • All saved categories ({savedCategories.length}{" "}
                            items)
                          </li>
                          <li>
                            • All your feedback and comments (
                            {feedbackList.length} items)
                          </li>
                          <li>• Any other associated data</li>
                        </ul>
                      </div>

                      {deleteError && (
                        <div className="text-red-600 text-sm bg-red-100 p-3 rounded-md mb-4 border border-red-200">
                          {deleteError}
                        </div>
                      )}

                      {deleteSuccess && (
                        <div className="text-green-600 text-sm bg-green-100 p-3 rounded-md mb-4 border border-green-200">
                          ✅ Account deleted successfully. Redirecting...
                        </div>
                      )}

                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading || deleteSuccess}
                        className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteLoading ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Deleting Account...
                          </span>
                        ) : deleteSuccess ? (
                          "Account Deleted ✓"
                        ) : (
                          "Delete My Account"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
