import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
import Order from "./Order.js";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required."],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: [true, "{PATH} already exist. Please enter another email address."],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email address."
        }
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [4, "Password must be at least {MINLENGTH} characters long."]
    },
    shoppingBag: [{
        productId: {
            type: Schema.Types.ObjectId
        },
        quantity: {
            type: Number,
            min: 1,
            default: 1
        }
    }],
    wishlist: [Schema.Types.ObjectId],
    orders: [Order.schema]
}, { timestamps: true });

// Set up pre-save middleware to create password.
userSchema.pre("save", async function (next) {
    try {
        if (this.isNew || this.isModified("password")) {
            const saltRounds = 10;
            const hashedPassword = await hash(this.password, saltRounds);
            this.password = hashedPassword;
        }
        next();
    } catch (err) {
        console.log("error in save: ", err);
    }
});

// Set up pre-findOneAndUpdate middleware to change password.
userSchema.pre("findOneAndUpdate", async function (next) {
    try {
        if (this._update.password) {
            const saltRounds = 10;
            const hashedPassword = await hash(this._update.password, saltRounds);
            this._update.password = hashedPassword;
        }
        next();
    } catch (err) {
        console.log("error in update: ", err);
    }
});

// Compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
    return await compare(password, this.password);
};

const User = model("User", userSchema);

export default User;