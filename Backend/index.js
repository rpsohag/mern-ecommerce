import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';
import authRoute from './routes/authRoute.js'
import productRoute from './routes/productRoute.js'
import blogRoute from './routes/blogRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import morgan from 'morgan';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('hello from express')
})

app.use(express.json())
app.use(express.urlencoded({ extended : false}))
app.use(cookieParser())
app.use(morgan())
app.use('/api/user', authRoute)
app.use('/api/product', productRoute)
app.use('/api/blog', blogRoute)
app.use('/api/category', categoryRoute)


app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    dbConnect()
})