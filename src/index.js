import databaseConnection from './db/Connection.js'
import dotenv from 'dotenv'
import { app } from './app.js'

dotenv.config(
    {
        path: './.env'
    }
);

databaseConnection()
    .then(() => {
        app.listen(3905, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);

        });
    })
    .catch((error) => {
        console.log("MONGO db connection failed !!! ", error);
    });


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

