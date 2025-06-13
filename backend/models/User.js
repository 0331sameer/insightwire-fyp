const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authType === "local";
      },
    },
    profilePic: {
      type: String,
      required: false,
    },
    authType: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
    },
    googleId: {
      type: String,
      required: function () {
        return this.authType === "google";
      },
      sparse: true,
    },
    googleProfile: {
      displayName: String,
      email: String,
      photoURL: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password for local auth
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.authType !== "local") return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for local auth
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.authType !== "local") return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find or create Google user
userSchema.statics.findOrCreateGoogleUser = async function (googleProfile) {
  try {
    let user = await this.findOne({ googleId: googleProfile.id });

    if (!user) {
      user = await this.create({
        userName: googleProfile.displayName,
        email: googleProfile.emails[0].value,
        profilePic: googleProfile.photos[0].value,
        authType: "google",
        googleId: googleProfile.id,
        googleProfile: {
          displayName: googleProfile.displayName,
          email: googleProfile.emails[0].value,
          photoURL: googleProfile.photos[0].value,
        },
      });
    }

    return user;
  } catch (error) {
    throw error;
  }
};

// Index for better search performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
