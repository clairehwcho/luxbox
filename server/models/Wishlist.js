import { Schema, model } from "mongoose";

const wishlistSchema = new Schema({
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

const Wishlist = model("Wishlist", wishlistSchema);

export default Wishlist;