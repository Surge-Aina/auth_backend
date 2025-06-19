import dotenv from 'dotenv'
dotenv.config()

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/user.js'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value })
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: accessToken,
            role: 'admin',
          })
        }
        return done(null, user)
      } catch (err) {
        console.error('Google OAuth strategy error:', err)
        return done(err, null)
      }
    }
  )
)

//save user ID to session
passport.serializeUser((user, done) => {
  done(null, user.id) 
})

//attach user to req.user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    // User not found
    if (!user) {
      return done(null, false); 
    }
    done(null, user);
  } catch (err) {
    console.error('Deserialize user error:', err);
    done(err, null);
  }
})