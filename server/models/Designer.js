import { Schema, model } from "mongoose";

const designerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
});

const Designer = model("Designer", designerSchema);

export default Designer;