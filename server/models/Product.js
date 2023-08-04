import { Schema, model } from "mongoose";

const productSchema = new Schema({
    image: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    designer: {
        type: Schema.Types.ObjectId,
        ref: "Designer",
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0.99
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: "Color",
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
        required: true
    },
    quantity: {
        type: Number,
        min: 0,
        default: 0
    },
    onSale: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const Product = model("Product", productSchema);

export default Product;