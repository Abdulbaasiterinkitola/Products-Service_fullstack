import express from 'express';
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

    // if (!name || !description || !price || !imageUrl) {
    //     return res.status(StatusCodes.BAD_REQUEST).json({ message: 'All fields are required' });
    // }

    const newProduct = new Product({
        name,
        description,
        price,
        imageUrl
    });

    newProduct.save()
        .then(() => res.status(StatusCodes.CREATED).json({success: true, data: newProduct, message: 'Product created successfully' }))
        .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message }));
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(StatusCodes.OK).json({ success: true, data: products, message: 'Products fetched successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Product ID is required' });
        }
        const product = await Product.findById(id);
        res.status(StatusCodes.OK).json({ success: true, data: product, message: 'Product fetched successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;

    try {
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Product ID is required' });
        }
    
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name,
            description,
            price,
            imageUrl
        }, { new: true });
    
        res.status(StatusCodes.OK).json({ success: true, data: updatedProduct, message: 'Product updated successfully' });       
    }
    
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message })
    }
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Product ID is required' });
    }

    Product.findByIdAndDelete(id)
        .then((deletedProduct) => {
            if (!deletedProduct) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found' });
            }
            res.status(StatusCodes.OK).json({ success: true, data: deletedProduct, message: 'Product deleted successfully' });
        })
        .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message }));
})

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});