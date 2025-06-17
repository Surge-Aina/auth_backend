import mongoose from 'mongoose'

export const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('mongodb connected')
    }catch(error){
        console.error('could not connect to mongo database', error)
        process.exit(1)
    }
}