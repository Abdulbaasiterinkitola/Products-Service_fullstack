import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import {StatusCodes} from 'http-status-codes';
import productRouter from './route/product.js';
import { connectDB } from './config/db.js';
import Product from './model/product.js';

const app = express();
configDotenv();

// Middleware to parse JSON
app.use(express.json());

app.use(cors());
app.use("/api/v1/products", productRouter);

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});