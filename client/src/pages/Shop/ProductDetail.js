import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { QUERY_USER } from '../../utils/queries';
import { useStoreContext } from '../../utils/GlobalState';

import {
    UPDATE_PRODUCTS,
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
} from '../../utils/actions';
import {
    QUERY_PRODUCTS,
    QUERY_CATEGORIES,
    QUERY_SUBCATEGORIES,
} from '../../utils/queries';
import { formatCurrency, idbPromise } from '../../utils/helpers';

const ProductDetail = (props) => {
    const { designerParam, categoryParam, subcategoryParam, nameParam } = useParams();

    const [state, dispatch] = useStoreContext();

    const { products, shoppingBag } = state;

    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(QUERY_PRODUCTS);
    const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery(QUERY_CATEGORIES);
    const { loading: subcategoriesLoading, error: subcategoriesError, data: subcategoriesData } = useQuery(QUERY_SUBCATEGORIES);

    useEffect(() => {
        try {
            if (productsData) {
                dispatch({
                    type: UPDATE_PRODUCTS,
                    payload: productsData.products
                });
                productsData.products.forEach((product) => {
                    idbPromise("products", "put", product);

                })
            } else if (!productsLoading) {
                idbPromise("products", "get").then((products) => {
                    dispatch({
                        type: UPDATE_PRODUCTS,
                        products: products,
                    });
                });
            } else if (productsError) {
                console.error(productsError);
            }
        } catch (error) {
            console.error(error);
        }
    }, [productsData, productsLoading, productsError, dispatch]);


    // Get categories.
    useEffect(() => {
        try {
            if (categoriesData) {
                dispatch({
                    type: UPDATE_CATEGORIES,
                    payload: categoriesData.categories,
                });
                categoriesData.categories.forEach((category) => {
                    idbPromise("categories", "put", category);

                    if (category.name === categoryParam) {
                        dispatch({
                            type: UPDATE_CURRENT_CATEGORY,
                            payload: category._id,
                        });
                    }
                });
            } else if (!categoriesLoading) {
                idbPromise("categories", "get").then((categories) => {
                    dispatch({
                        type: UPDATE_CATEGORIES,
                        payload: categories,
                    });
                });
            } else if (categoriesError) {
                console.error(categoriesError);
            }
        } catch (error) {
            console.error(error);
        }
    }, [categoriesData, categoriesLoading, categoriesError, dispatch, categoryParam]);

    // Get subcategories.
    useEffect(() => {
        try {
            if (subcategoriesData) {
                dispatch({
                    type: UPDATE_SUBCATEGORIES,
                    payload: subcategoriesData.subcategories,
                });
                subcategoriesData.subcategories.forEach((subcategory) => {
                    idbPromise("subcategories", "put", subcategory);

                    if (subcategory.name === subcategoryParam) {
                        dispatch({
                            type: UPDATE_CURRENT_SUBCATEGORY,
                            payload: subcategory._id,
                        });
                    }
                });
            } else if (!subcategoriesLoading) {
                idbPromise("subcategories", "get").then((subcategories) => {
                    dispatch({
                        type: UPDATE_SUBCATEGORIES,
                        payload: subcategories,
                    });
                });
            } else if (subcategoriesError) {
                console.error(subcategoriesError);
            }
        } catch (error) {
            console.error(error);
        }
    }, [subcategoriesData, subcategoriesLoading, subcategoriesError, dispatch, subcategoryParam]);



    const singleProduct = () => {
        for (let i = 0; i < state.products.length; i++) {
            const currentProduct = state.products[i];
            if (
                currentProduct.designer.name === designerParam &&
                currentProduct.category.name === categoryParam &&
                currentProduct.name === nameParam
            ) {
                return currentProduct;
            }
        }
        return;
    }

    function addToWishlist () {
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
        return setQuantityState(quantityState+1);
    };

    const handleDecrement = () => {
        if (quantityState > 1) {
            return setQuantityState(quantityState-1);
        };
    };

    return (
        <section className="main-content-container">
            {singleProduct() !== undefined && (
                <div className="product-detail-wrapper">
                    <div className="product-detail-image">
                        <img src={require(`../../assets/img/products/${singleProduct().category.name}/${singleProduct().image}.png`)} alt={singleProduct().name} />
                    </div >
                    <div className="product-detail-info">
                        <h3>{singleProduct().designer.name}</h3>
                        <p className="product-detail-name">{singleProduct().name}</p>
                        <div className="product-detail-price">
                            {singleProduct().onSale === true
                                ? (
                                    <div className="sale-price-wrapper">
                                        <span className="original-price">{formatCurrency(singleProduct().price)}</span>
                                        <span className="sale-price">{formatCurrency(getSalePrice(singleProduct().price))}</span>
                                    </div>
                                )
                                : formatCurrency(singleProduct().price)
                            }
                        </div>
                        <p className="product-detail-color">Color: {singleProduct().color.name}</p>
                        <div className="product-detail-quantity">
                            <button className="quantity-input-modifier quantity-input-decrement-button" onClick={handleDecrement}>&minus;</button>
                            <input className="quantity-input-screen" type="text" value={quantityState} readOnly/>
                            <button className="quantity-input-modifier quantity-input-increment-button" onClick={handleIncrement}>&#43;</button>
                        </div>
                        <div className="product-detail-button-wrapper">
                            <button className="filled-btn" onClick={addToShoppingBag}>
                                Add to Bag
                            </button>
                            <button className="outlined-btn" onClick={addToWishlist}>
                                Add to Wish List
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section >
    );
};

export default ProductDetail;