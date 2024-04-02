import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_TO_SHOPPING_BAG = gql`
  mutation AddToShoppingBag(
    $productId: ID!,
    $quantity: Int!
    ) {
      addToShoppingBag(
        shoppingBag: {
          productId: $productId,
          quantity: $quantity
        }
        ) {
          token
          user {
            _id
          }
        }
      }
`;

export const REMOVE_FROM_SHOPPING_BAG = gql`
  mutation RemoveFromShoppingBag(
    $productId: ID!
  ) {
    removeFromShoppingBag(
      shoppingBag: {
        productId: $productId
      }
      ) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist(
    $productId: ID!
    ) {
      addToWishlist(
        wishlist: $productId
        ) {
          token
          user {
            _id
          }
        }
      }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist(
    $productId: ID!
  ) {
    removeFromWishlist(
      wishlist: $productId
    ) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_ORDER = gql`
  mutation AddOrder($products: [ID]!) {
    addOrder(products: $products) {
      purchaseDate
      products {
        _id
        name
        designer {
          name
        }
        color {
          name
        }
        price
        quantity
        category {
          name
        }
        subcategory {
          name
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser(
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $password: String!
  ) {
    addUser(
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      password: $password
    ) {
      token
      user {
        _id
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $_id: ID!,
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $password: String!
  ) {
    updateUser(
      _id: $_id,
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      password: $password
    ) {
      token
      user {
        _id
      }
    }
  }
`;