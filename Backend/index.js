import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';
import authRoute from './routes/authRoute.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('hello from express')
})

app.use(express.json())
app.use(express.urlencoded({ extended : false}))
app.use(cookieParser())
app.use('/api/user', authRoute)


app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    dbConnect()
})