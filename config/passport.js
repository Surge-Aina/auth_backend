import dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '../models/user.js'

//google passport strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_API_URL}/auth/google/callback`,//'/api/auth/google/callback',
      passReqToCallback: true //needed to access req in callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const role = req.session.role || 'customer' //get role passed from front end query parameters
        let user = await User.findOne({ email: profile.emails[0].value })
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleID: profile.id,
            role: role,
          })
        }
        return done(null, user)
      } 
      catch (err) {
        console.error('Google OAuth strategy error:', err)
        return done(err, null)
      }
    }
  )
)

//email and password passport local strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) =>{
      try{
        const user = await User.findOne({email: email})
        if(!user){
          return done(null, false, {message:'Incorrect username'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
          return done(null, false, {message:'Incorrect password'})
        }
        return done(null, user)
      }
      catch(error){
        console.error('local strategy error', error)
        return done(error, null)
      }
    }

  )
)




//save user ID to session
passport.serializeUser((user, done) => {
  done(null, user.id) 
})

//use ID stored in session to get user stored 
//in database and attach user to req.user
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