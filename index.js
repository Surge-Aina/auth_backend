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

const app = express()
const PORT = process.env.PORT || 5000
const mongodb = await connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true   //allow cookies to be sent
}))

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
            sameSite: 'lax',
            secure: false,//only use secure when in produnction: requires https
        }
    })
)

//initialize passport
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', loginRoutes)

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`)
})