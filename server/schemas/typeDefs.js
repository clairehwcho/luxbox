const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define which fields are accessible from the model

  type Category {
    _id: ID
    name: String
  }

  type Subcategory {
    _id: ID
    name: String
  }

  type Color {
    _id: ID
    name: String
  }

  type Designer {
    _id: ID
    name: String
  }

  type Product {
    _id: ID
    image: String
    name: String
    designer: Designer
    category: Category
    subcategory: Subcategory
    color: Color
    quantity: Int
    price: Float
    onSale: Boolean
    createdAt: String
    updatedAt: String
  }

  type Order {
    _id: ID
    purchaseDate: String
    products: [Product]
  }

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    orders: [Order]
  }

  type Checkout {
    session: ID
  }

  # Set up an Auth type to handle returning data from a user creating or user login
  type Auth {
    token: ID
    user: User
  }

  # Define which queries the front end is allowed to make and what data is returned
  type Query {
    categories: [Category]
    subcategories: [Subcategory]
    colors: [Color]
    designers: [Designer]
    products(category: ID, subcategory: ID, color: ID, designer: ID, name: String): [Product]
    product(_id: ID!): Product
    user: User
    order(_id: ID!): Order
    checkout(products: [ID]!): Checkout
  }

  # Define which mutations the client is allowed to make
  type Mutation {
    # Set the required fields
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addOrder(products: [ID]!): Order
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updateProduct(_id: ID!, quantity: Int!): Product
    login(email: String!, password: String!): Auth
  }
  `;

module.exports = typeDefs;