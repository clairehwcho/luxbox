import { gql } from '@apollo/client';

export const QUERY_PRODUCTS = gql`
  query GetProducts {
    products {
      _id
      image
      designer {
        _id
        name
      }
      name
      price
      color {
        _id
        name
      }
      quantity
      category {
        _id
        name
      }
      subcategory {
        _id
        name
        category {
          _id
          name
        }
      }
      onSale
      createdAt
      updatedAt
    }
  }
`;

export const QUERY_CHECKOUT = gql`
  query GetCheckout($products: [ID]!) {
    checkout(products: $products) {
      session
    }
  }
`;

export const QUERY_CATEGORIES = gql`
  query GetCategories {
    categories {
      _id
      name
    }
  }
`;

export const QUERY_SUBCATEGORIES = gql`
  query GetSubcategories {
    subcategories {
      _id
      name
      category {
        _id
        name
      }
    }
  }
`;

export const QUERY_DESIGNERS = gql`
  query GetDesigners {
    designers {
      _id
      name
    }
  }
`;

export const QUERY_COLORS = gql`
  {
    colors {
      _id
      name
    }
  }
`;

export const QUERY_USER = gql`
  {
    user {
      firstName
      lastName
      email
      orders {
        _id
        purchaseDate
        products {
          _id
          image
          designer {
            _id
            name
          }
          category {
            _id
            name
          }
          subcategory {
            _id
            name
            category {
              _id
              name
            }
          }
          name
          price
          color {
            _id
            name
          }
          quantity
        }
      }
    }
  }
`;