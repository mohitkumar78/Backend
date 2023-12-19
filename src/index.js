import databaseConnection from './db/Connection.js'
import dotenv from 'dotenv'

dotenv.config({
    path: "./env"
})
databaseConnection();


/*
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import { DB_NAME } from './constants.js';
const app = express();
dotenv.config();
console.log("port is : ", process.env.PORT);
console.log("mongo url", process.env.MONGODB_URI);
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("database connected")
        app.on("error", (error) => {
            console.log("Errr");
            throw error;
        })

    }
    catch (error) {
        console.log("Error:", error);
        throw error;
    }
})()

*/