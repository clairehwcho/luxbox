import { useReducer } from "react";
import {
    UPDATE_PRODUCTS,
    UPDATE_CURRENT_PRODUCT,
    ADD_TO_SHOPPING_BAG,
    UPDATE_SHOPPING_BAG_QUANTITY,
    REMOVE_FROM_SHOPPING_BAG,
    ADD_MULTIPLE_TO_SHOPPING_BAG,
    ADD_TO_WISHLIST,
    REMOVE_FROM_WISHLIST,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    UPDATE_SUBCATEGORIES,
    UPDATE_CLOTHING_SUBCATEGORIES,
    UPDATE_SHOES_SUBCATEGORIES,
    UPDATE_BAGS_SUBCATEGORIES,
    UPDATE_JEWELRY_AND_ACCESSORIES_SUBCATEGORIES,
    UPDATE_BEAUTY_SUBCATEGORIES,
    UPDATE_HOME_SUBCATEGORIES,
    UPDATE_CURRENT_SUBCATEGORY,
    UPDATE_DESIGNERS,
    UPDATE_CURRENT_DESIGNER,
    UPDATE_COLORS,
    UPDATE_CURRENT_COLOR,
    CLEAR_SHOPPING_BAG,
    TOGGLE_SHOPPING_BAG
} from "./actions";


// The reducer function takes the current state, applies an action object on it and returns a new state.
export const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.payload],
            };

        case UPDATE_CURRENT_PRODUCT:
            return {
                ...state,
                currentProduct: action.payload,
            };

        case ADD_TO_SHOPPING_BAG:
            return {
                ...state,
                shoppingBagOpen: true,
                shoppingBag: [...state.shoppingBag, action.payload],
            };

        case ADD_MULTIPLE_TO_SHOPPING_BAG:
            return {
                ...state,
                shoppingBag: [...state.shoppingBag, ...action.payload],
            };

        case UPDATE_SHOPPING_BAG_QUANTITY:
            return {
                ...state,
                shoppingBagOpen: true,
                shoppingBag: state.shoppingBag.map(product => {
                    if (action._id === product._id) {
                        product.purchaseQuantity = action.purchaseQuantity
                    }
                    return product
                })
            };

        case REMOVE_FROM_SHOPPING_BAG:
            let newShoppingBagState = state.shoppingBag.filter(product => {
                return product._id !== action._id;
            });

            return {
                ...state,
                shoppingBagOpen: newShoppingBagState.length > 0,
                shoppingBag: newShoppingBagState
            };

        case CLEAR_SHOPPING_BAG:
            return {
                ...state,
                shoppingBagOpen: false,
                shoppingBag: []
            };

        case TOGGLE_SHOPPING_BAG:
            return {
                ...state,
                shoppingBagOpen: !state.shoppingBagOpen
            };

        case ADD_TO_WISHLIST:
            return {
                ...state,
                wishlist: [...state.wishlist, action.payload],
            };

        case REMOVE_FROM_WISHLIST:
            let newWishlistState = state.wishlist.filter(product => {
                return product._id !== action._id;
            });

            return {
                ...state,
                wishlist: newWishlistState
            };

        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.payload],
            };

        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.payload
            }

        case UPDATE_SUBCATEGORIES:
            return {
                ...state,
                subcategories: [...action.payload],
            };

        case UPDATE_CLOTHING_SUBCATEGORIES:
            return {
                ...state,
                clothingSubcategories: [...action.payload],
            };

        case UPDATE_SHOES_SUBCATEGORIES:
            return {
                ...state,
                shoesSubcategories: [...action.payload],
            };

        case UPDATE_BAGS_SUBCATEGORIES:
            return {
                ...state,
                bagsSubcategories: [...action.payload],
            };

        case UPDATE_JEWELRY_AND_ACCESSORIES_SUBCATEGORIES:
            return {
                ...state,
                jewelryAndAccessoriesSubcategories: [...action.payload],
            };

        case UPDATE_BEAUTY_SUBCATEGORIES:
            return {
                ...state,
                beautySubcategories: [...action.payload],
            };

        case UPDATE_HOME_SUBCATEGORIES:
            return {
                ...state,
                homeSubcategories: [...action.payload],
            };

        case UPDATE_CURRENT_SUBCATEGORY:
            return {
                ...state,
                currentSubcategory: action.payload
            }

        case UPDATE_DESIGNERS:
            return {
                ...state,
                designers: [...action.payload],
            };

        case UPDATE_CURRENT_DESIGNER:
            return {
                ...state,
                currentDesigner: action.payload
            }

        case UPDATE_COLORS:
            return {
                ...state,
                colors: [...action.payload],
            };

        case UPDATE_CURRENT_COLOR:
            return {
                ...state,
                currentColor: action.payload
            }

        default:
            return state;
    }
};

// The useReducer hook takes the reducer function that contains custom state logic and the initialState.
// The useReducer hook returns an array of the current state and the dispatch function that dispatches an action object.
export const useProductReducer = (initialState) => {
    return useReducer(reducer, initialState)
}