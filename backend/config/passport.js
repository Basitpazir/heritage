require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // SWAPPED: changed 'google/callback' to 'callback/google' to match your screenshot
    callbackURL: process.env.NODE_ENV === 'production' 
        ? "https://heritage-backend-mu.vercel.app/api/auth/callback/google" 
        : "http://localhost:5000/api/auth/callback/google"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            return done(null, user);
        }

        user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: `google_${profile.id}_${Date.now()}`,
            googleId: profile.id
        });

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;