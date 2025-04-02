import express from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import {StatusCodes} from 'http-status-codes';
import { connectDB } from './config/db.js';
import Product from './model/product.js';

const app = express();
configDotenv();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

app.post('/products', async (req, res) => {
    const { name, description, price, imageUrl } = req.body;

    if (!name || !description || !price || !imageUrl) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'All fields are required' });
    }

    const newProduct = new Product({
        name,
        description,
        price,
        imageUrl,
    });

    newProduct.save()
        .then(() => res.status(StatusCodes.CREATED).json({success: true, data: newProduct}))
        .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message }));
});

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});