import Product from "../model/product.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => { 
  try {
    const products = await Product.find();
    res.status(StatusCodes.OK).json({
      success: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export const getProductById = async (req, res) => { 
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      data: product,
      message: "Product fetched successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export const createProduct = async (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  if (!name || !description || !price || !imageUrl) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "All fields are required",
    });
  }

  const newProduct = new Product({
    name,
    description,
    price,
    imageUrl,
  });

  newProduct
    .save()
    .then(() =>
      res
        .status(StatusCodes.CREATED)
        .json({
          success: true,
          data: newProduct,
          message: "Product created successfully",
        })
    )
    .catch((error) =>
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message })
    );
}

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl } = req.body;

  try {
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid Product ID",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        imageUrl,
      },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Product ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Product ID' });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found' });
        }
        res.status(StatusCodes.OK).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}