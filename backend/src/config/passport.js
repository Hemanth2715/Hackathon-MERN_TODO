const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "your_google_client_id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "your_google_client_secret",
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update last login
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.provider = "google";
          user.avatar = profile.photos[0]?.value || "";
          user.isVerified = true;
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0]?.value || "",
          provider: "google",
          isVerified: true,
          lastLogin: new Date(),
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "fallback_secret",
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select("-password");
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize/Deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
