import { createContext, useContext } from 'react';

import { useProductReducer } from './reducers';

// Context is an API built into React that can be used to pass data through the component tree without having to pass props down manually at every level.
// Create a context object that components can provide or read by passing it to useContext().
const StoreContext = createContext();

// Declare Provider component that wraps around the children components using object destructuring.
const { Provider } = StoreContext;

// Create a Provider component.
const StoreProvider = ({ value = [], ...props }) => {
    // Declare state and dispatch using custom useReducer hook using array destructuring.
    const [state, dispatch] = useProductReducer({
        products: [],
        shoppingBag: [],
        wishlist: [],
        shoppingBagOpen: false,
        categories: [],
        subcategories: [],
        clothingSubcategories: [],
        shoesSubcategories: [],
        bagsSubcategories: [],
        jewelryAndAccessoriesSubcategories: [],
        beautySubcategories: [],
        homeSubcategories: [],
        designers: [],
        colors: [],
        currentCategory: '',
        currentSubcategory: '',
        currentDesigner: '',
        currentColor: ''
    });

    return <Provider value={[state, dispatch]} {...props} />;
};

// The useContext hook returns the context value for the calling component that is determined as the value passed to the closest Provider component, which needs to be above the component doing the useContext() call.
const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };