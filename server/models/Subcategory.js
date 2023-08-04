import { Schema, model } from "mongoose";

const subcategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
});

const Subcategory = model("Subcategory", subcategorySchema);

export default Subcategory;