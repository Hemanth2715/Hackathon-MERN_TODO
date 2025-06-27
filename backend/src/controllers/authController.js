const User = require("../models/User");
const { generateToken } = require("../middleware/auth");

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      provider: "local",
      isVerified: true, // Auto-verify for simplicity
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          provider: user.provider,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          provider: user.provider,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during profile update",
    });
  }
};

// Google OAuth success callback
const googleSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/login?error=oauth_failed`
      );
    }

    // Generate token
    const token = generateToken(req.user._id);

    // Redirect to frontend with token
    res.redirect(
      `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/auth/success?token=${token}`
    );
  } catch (error) {
    console.error("Google OAuth success error:", error);
    res.redirect(
      `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/login?error=oauth_failed`
    );
  }
};

// Google OAuth failure callback
const googleFailure = (req, res) => {
  res.redirect(
    `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/login?error=oauth_failed`
  );
};

// Logout user (client-side token removal, server-side session destroy)
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error during logout",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error destroying session",
        });
      }

      res.json({
        success: true,
        message: "Logout successful",
      });
    });
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  googleSuccess,
  googleFailure,
  logout,
};
