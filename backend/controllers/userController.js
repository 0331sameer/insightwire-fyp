const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SavedCategory = require("../models/SavedCategory");
const Feedback = require("../models/Feedback");

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      authType,
      googleId,
      googleProfile,
      profilePic,
    } = req.body;

    if (!email || !authType)
      return res.status(400).json({ msg: "Missing fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    let newUser;
    if (authType === "local") {
      if (!password)
        return res
          .status(400)
          .json({ msg: "Password is required for local authentication" });
      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = new User({
        userName,
        email,
        password: hashedPassword,
        authType,
        profilePic,
      });
    } else if (authType === "google") {
      if (!googleId || !googleProfile)
        return res
          .status(400)
          .json({ msg: "Google authentication details required" });
      newUser = new User({
        userName,
        email,
        googleId,
        googleProfile,
        authType,
        profilePic,
      });
    } else {
      return res.status(400).json({ msg: "Invalid authentication type" });
    }

    await newUser.save();
    res
      .status(201)
      .json({ msg: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          profilePic: user.profilePic,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete user and cascade delete their saved categories and feedback
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user;
    // Delete user
    await User.findByIdAndDelete(userId);
    // Delete all saved categories for user
    await SavedCategory.deleteMany({ userId });
    // Delete all feedback for user
    await Feedback.deleteMany({ userId });
    res.json({
      success: true,
      message: "Account and all related data deleted.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete account." });
  }
};

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if user is local auth (not Google)
    if (user.authType !== "local") {
      return res.status(400).json({
        success: false,
        error: "Password change is only available for local accounts",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to change password",
    });
  }
};
