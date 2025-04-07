import mongoose from "mongoose";

export interface ProductDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose.Types.ObjectId, ref: "user" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date , default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});

export const Product = mongoose.model<ProductDocument>("product", productSchema);
