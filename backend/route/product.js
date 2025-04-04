import express from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controller/product.js";

const productRouter = express.Router();

// Define the routes for the product service
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;