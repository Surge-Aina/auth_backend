import mongoose from 'mongoose'
//function: connectDB
//parameters:none
//returns:connection to mongoDB
//description:connects to mongoDB using the mongoURI in the ENV variables
export const connectDB = async() =>{
    try{
        const mongodb = await mongoose.connect(process.env.MONGO_URI)
        console.log('mongodb connected')
        return mongodb
    }catch(error){
        console.error('could not connect to mongo database', error)
        process.exit(1)
    }
}