import { Product, ProductDocument } from "../model/product.model";
import { validationResult } from "express-validator";
import { Request, Response } from "express";

export const saveProduct = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const createProduct: ProductDocument = req.body;
        const newProduct = new Product(createProduct);
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product saved successfully", result: savedProduct });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find({ isDeleted: false });
        res.status(200).json({ message: "Products fetched successfully", result:products });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
};

export const getSingleProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById({ _id: req.query._id });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product fetched successfully", result:product });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedProduct: ProductDocument = req.body;
        
        const updatedData = await Product.findByIdAndUpdate(
            req.body._id,
            {
                $set: {
                    name: updatedProduct.name,
                    description: updatedProduct.description,
                    price: updatedProduct.price,
                    stock: updatedProduct.stock,
                    image: updatedProduct.image,
                    status: updatedProduct.status,
                    modifiedOn: new Date(),
                    modifiedBy: updatedProduct.modifiedBy
                }
            },
            { new: true } 
        );

        if (!updatedData) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json({ message: "Product updated successfully", result: updatedData });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndUpdate(req.query._id, { $set: { isDeleted: true } });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
};

export const filterProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, createdOn, stock } = req.query;
  
      const filter: Record<string, unknown> = { isDeleted: false };
  
      if (name) {
        filter.name = { $regex: new RegExp(String(name), "i") };
      } else if (stock !== undefined) {
        const stockValue = Number(stock);
        filter.stock = { $gte: stockValue };
      }else if (createdOn) {
        const date = new Date(String(createdOn));
        const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
        filter.createdOn = { $gte: startOfDay, $lt: endOfDay };
      } 
       else {
         res.status(400).json({ message: "No filter values provided" });
      }
  
      const products = await Product.find(filter);
      res.status(200).json({
        message: "Filtered products fetched successfully",
        result: products,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({
        message: "Internal Server Error",
        error: errorMessage,
      });
    }
  };
  
  