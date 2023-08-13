import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { QUERY_USER } from '../../utils/queries';
import { useStoreContext } from '../../utils/GlobalState';
import Auth from '../../utils/auth';

import {
    UPDATE_PRODUCTS,
    UPDATE_CURRENT_PRODUCT,
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
    ADD_TO_WISHLIST,
} from '../../utils/actions';
import {
    QUERY_PRODUCTS,
    QUERY_CATEGORIES,
    QUERY_SUBCATEGORIES,
} from '../../utils/queries';
import { formatCurrency, idbPromise } from '../../utils/helpers';
import NotFound from '../../components/Product/NotFound';

const ProductDetail = (props) => {
    const [currentProductState, setCurrentProductState] = useState();
    const [isInWishlistState, setIsInWishlistState] = useState(false);

    const { designerParam, categoryParam, subcategoryParam, nameParam } = useParams();

    const [state, dispatch] = useStoreContext();

    const { products, shoppingBag, wishlist } = state;

    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(QUERY_PRODUCTS);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (productsData) {
                for (let i = 0; i < productsData.products.length; i++) {
                    const currentProduct = productsData.products[i];
                    if (
                        currentProduct.designer.name === designerParam &&
                        currentProduct.category.name === categoryParam &&
                        currentProduct.name === nameParam
                    ) {
                        dispatch({
                            type: UPDATE_CURRENT_PRODUCT,
                            payload: currentProduct
                        });
                        setCurrentProductState(currentProduct);
                        if (wishlist.find((wishlistProduct) => wishlistProduct._id === currentProduct._id)) {
                            setIsInWishlistState(true);
                        }
                    }
                }
                return;
            }
        } catch (error) {
            console.error(error);
        }
    }, [categoryParam, designerParam, dispatch, nameParam, productsData, wishlist]);

    const addToWishlist = () => {
        if (!Auth.loggedIn()) {
            return navigate("/account/sign-in");
        }
        
        const productInWishlist = wishlist.find((wishlistProduct) => wishlistProduct._id === currentProductState._id);
        if (!productInWishlist) {
            dispatch({
                type: ADD_TO_WISHLIST,
                payload: currentProductState
            });
            idbPromise("wishlist", "put", currentProductState);
            console.log(wishlist);
        };
    };


    const removeFromWishlist = () => {

    }

    const addToShoppingBag = () => {
        // const itemInShoppingBag = shoppingBag.find((shoppingBagItem) => shoppingBagItem._id === id);
        // if (itemInShoppingBag) {
        //     dispatch({
        //         type: UPDATE_CART_QUANTITY,
        //         _id: id,
        //         purchaseQuantity: parseInt(itemInShoppingBag.purchaseQuantity) + 1,
        //     });
        //     idbPromise('shoppingBag', 'put', {
        //         ...itemInShoppingBag,
        //         purchaseQuantity: parseInt(itemInShoppingBag.purchaseQuantity) + 1,
        //     });
        // } else {
        //     dispatch({
        //         type: ADD_TO_CART,
        //         product: { ...currentProduct, purchaseQuantity: 1 },
        //     });
        //     idbPromise('shoppingBag', 'put', { ...currentProduct, purchaseQuantity: 1 });
        // }
    };

    // const removeFromShoppingBag = () => {
    //     dispatch({
    //         type: REMOVE_FROM_CART,
    //         _id: currentProduct._id,
    //     });

    //     idbPromise('shoppingBag', 'delete', { ...currentProduct });

    const getSalePrice = (price) => {
        return (Math.ceil(price * 0.8));
    };

    // Handle quantity input
    const [quantityState, setQuantityState] = useState(1)

    const handleIncrement = () => {
        return setQuantityState(quantityState + 1);
    };

    const handleDecrement = () => {
        if (quantityState > 1) {
            return setQuantityState(quantityState - 1);
        };
    };

    return (
        <section className="main-content-container">
            {currentProductState
                ? (
                    <div className="product-detail-wrapper">
                        <div className="product-detail-image">
                            <img src={require(`../../assets/img/products/${currentProductState.category.name}/${currentProductState.image}.png`)} alt={currentProductState.name} />
                        </div >
                        <div className="product-detail-info">
                            <h3>{currentProductState.designer.name}</h3>
                            <p className="product-detail-name">{currentProductState.name}</p>
                            <div className="product-detail-price">
                                {currentProductState.onSale === true
                                    ? (
                                        <div className="sale-price-wrapper">
                                            <span className="original-price">{formatCurrency(currentProductState.price)}</span>
                                            <span className="sale-price">{formatCurrency(getSalePrice(currentProductState.price))}</span>
                                        </div>
                                    )
                                    : formatCurrency(currentProductState.price)
                                }
                            </div>
                            <p className="product-detail-color">Color: {currentProductState.color.name}</p>
                            <div className="product-detail-quantity">
                                <button className="quantity-input-modifier quantity-input-decrement-button" onClick={handleDecrement}>&minus;</button>
                                <input className="quantity-input-screen" type="text" value={quantityState} readOnly />
                                <button className="quantity-input-modifier quantity-input-increment-button" onClick={handleIncrement}>&#43;</button>
                            </div>
                            <div className="product-detail-button-wrapper">
                                <button className="filled-btn" onClick={addToShoppingBag}>
                                    Add to Bag
                                </button>
                                {isInWishlistState
                                    ? (
                                        <button className="outlined-btn" onClick={removeFromWishlist}>
                                            Remove from Wish List
                                        </button>
                                    )
                                    : (
                                        <button className="outlined-btn" onClick={addToWishlist}>
                                            Add to Wish List
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
                : <NotFound />
            }
        </section >
    );
};

export default ProductDetail;