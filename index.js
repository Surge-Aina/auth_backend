import express from 'express'
import { connectDB } from './config/db.js'
import loginRoutes from './routes/loginRoutes.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8000

connectDB()
app.use(express.json())
app.use('/api', loginRoutes)

app.listen(PORT,()=>{
    console.log(`Server started on PORT: ${PORT}`)
})