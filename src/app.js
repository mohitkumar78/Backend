import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
})
)
app.use(express.json({ limit: "20kb" }))
app.use(urlencoded({ limit: "20kb" }))
app.use(express.static('public'))
app.use(cookieParser())

// routes import

import userRouter from './routes/user.routes.js'


// route declartion\
app.use("/api/v1/users", userRouter)
export { app }