const express = require("express");
const passport = require("passport");
const { authMiddleware } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validation");
const {
  register,
  login,
  getProfile,
  updateProfile,
  googleSuccess,
  googleFailure,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// Local authentication routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  googleSuccess
);

router.get("/google/failure", googleFailure);

// Token verification route
router.get("/verify", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    data: {
      user: req.user,
    },
  });
});

module.exports = router;
