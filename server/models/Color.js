import { Schema, model } from "mongoose";

const colorSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
});

const Color = model("Color", colorSchema);

export default Color;