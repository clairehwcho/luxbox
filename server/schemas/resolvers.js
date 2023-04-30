const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Color, Designer, Order } = require('../models');
const { signToken } = require('../utils/auth');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// A resolver is a function that's responsible for populating the data for a single field in your schema.
// Create the functions that fulfill the queries defined in `typeDefs.js`
const resolvers = {
    Query: {
        categories: async () => {
            return await Category.find();
        },
        colors: async () => {
            return await Color.find();
        },
        designers: async () => {
            return await Designer.find();
        },
        products: async (parent, { category, color, designer, name }) => {
            const params = {};

            if (category) {
                params.category = category;
            }

            if (color) {
                params.color = color;
            }

            if (designer) {
                params.designer = designer;
            }

            if (name) {
                params.name = {
                    $regex: name
                };
            }

            return await Product.find(params).populate('category').populate('color').populate('designer');
        },
        product: async (parent, { _id }) => {
            return await Product.findById(_id).populate('category').populate('color').populate('designer');
        },
        user: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id).populate({
                    path: 'orders.products',
                    populate: 'category'
                });

                user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

                return user;
            }

            throw new AuthenticationError('Not logged in');
        },
        order: async (parent, { _id }, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id).populate({
                    path: 'orders.products',
                    populate: 'category'
                });

                return user.orders.id(_id);
            }

            throw new AuthenticationError('Not logged in');
        },
        checkout: async (parent, args, context) => {
            const url = new URL(context.headers.referer).origin;
            const order = new Order({ products: args.products });
            const line_items = [];

            const { products } = await order.populate('products');

            for (let i = 0; i < products.length; i++) {
                const product = await stripe.products.create({
                    name: products[i].name,
                    description: products[i].description,
                    images: [`${url}/images/${products[i].image}`]
                });

                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: products[i].price * 100,
                    currency: 'usd',
                });

                line_items.push({
                    price: price.id,
                    quantity: 1
                });
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${url}/`
            });

            return { session: session.id };
        }
    },
    // Define the functions that will fulfill the mutations
    Mutation: {
        addUser: async (parent, args) => {
            // First we create the user
            const user = await User.create(args);
            // To reduce friction for the user, we immediately sign a JSON Web Token and log the user in after they are created
            const token = signToken(user);

            // Return an `Auth` object that consists of the signed token and user's information
            return { token, user };
        },
        addOrder: async (parent, { products }, context) => {
            console.log(context);
            if (context.user) {
                const order = new Order({ products });

                await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

                return order;
            }

            throw new AuthenticationError('Not logged in');
        },
        updateUser: async (parent, args, context) => {
            if (context.user) {
                return await User.findByIdAndUpdate(context.user._id, args, { new: true });
            }

            throw new AuthenticationError('Not logged in');
        },
        updateProduct: async (parent, { _id, quantity }) => {
            const decrement = Math.abs(quantity) * -1;

            return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
        },
        login: async (parent, { email, password }) => {
            // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
            const user = await User.findOne({ email });

            // If there is no user with that email address, return an Authentication error stating so
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
            const correctPw = await user.isCorrectPassword(password);

            // If the password is incorrect, return an Authentication error stating so
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // If email and password are correct, sign user into the application with a JWT
            const token = signToken(user);

            // Return an `Auth` object that consists of the signed token and user's information
            return { token, user };
        }
    }
};

module.exports = resolvers;