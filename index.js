import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { connectDB } from './config/db.js'
import loginRoutes from './routes/loginRoutes.js'
import cors from 'cors'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import './config/passport.js'
import rateLimit from 'express-rate-limit'

const app = express()
const PORT = process.env.PORT || 5000
const mongodb = await connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// old cors
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     credentials: true   //allow cookies to be sent
// }))

const allowedOrigins = [
  'http://localhost:3000',
  'https://auth-frontend-sand.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
      console.log("still error");
    }
  },
  credentials: true
}));

//express-session
app.use(
    session({
        secret: process.env.SESSION_KEY_1,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({  //save session to mongoDB under collection name 'sessions'
            client: mongodb.connection.getClient(), 
            collectionName: 'sessions',
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure:  process.env.NODE_ENV === 'production' || false,//only use secure when in produnction: requires https
        }
    })
)

//initialize passport
app.use(passport.initialize())
app.use(passport.session())

//global rate limiter
const globalLimiter = rateLimit({
    windowMs: 12 * 60 * 1000,   //15 minutes
    max: 100,                    //max requests per ip
    message: 'Too many requests, please try again later'
})

app.use(globalLimiter)
app.use('/', loginRoutes)

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`)
})