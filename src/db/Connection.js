import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
import { DB_NAME } from '../constants.js'
const databaseConnection = async () => {
    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("database connected on", ConnectionInstance.connection.host)
    }
    catch (error) {
        console.log("Error is occur :", error)
    }
}

export default databaseConnection;