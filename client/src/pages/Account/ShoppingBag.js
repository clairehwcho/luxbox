import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import ProductCard from "../../components/Product/ProductCard";

import { QUERY_USER, QUERY_PRODUCTS } from "../../utils/queries";
import Auth from "../../utils/auth";

import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';

import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_SHOPPING_BAG, ADD_MULTIPLE_TO_SHOPPING_BAG } from '../../utils/actions';

import ShoppingBagProductCard from '../../components/Product/ShoppingBagProductCard';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const ShoppingBag = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Auth.loggedIn()) {
            return navigate("/account/sign-in");
        }
    }, [navigate]);

    const { loading: userLoading, error: userError, data: userData } = useQuery(QUERY_USER);
    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(QUERY_PRODUCTS);

    const user = userData?.user || {};
    const allProducts = productsData?.products || [];


    const filterShoppingBagProducts = () => {
        if (!userLoading) {
            if (user.shoppingBag !== undefined && user.shoppingBag.length > 0) {
                if (allProducts !== undefined) {
                    return allProducts.filter((product) => user.shoppingBag.includes(product._id))
                }
            }
        }
        return allProducts;
    }

    const getSalePrice = (price) => {
        return (Math.ceil(price * 0.8));
    };


    // const [state, dispatch] = useStoreContext();
    // const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

    // useEffect(() => {
    //     if (data) {
    //         stripePromise.then((res) => {
    //             res.redirectToCheckout({ sessionId: data.checkout.session });
    //         });
    //     }
    // }, [data]);

    // useEffect(() => {
    //     async function getShoppingBag () {
    //         const shoppingBag = await idbPromise('shoppingBag', 'get');
    //         dispatch({ type: ADD_MULTIPLE_TO_SHOPPING_BAG, products: [...shoppingBag] });
    //     }

    //     if (!state.shoppingBag.length) {
    //         getShoppingBag();
    //     }
    // }, [state.shoppingBag.length, dispatch]);

    // function toggleShoppingBag () {
    //     dispatch({ type: TOGGLE_SHOPPING_BAG });
    // }

    // function calculateTotal () {
    //     let sum = 0;
    //     state.shoppingBag.forEach((item) => {
    //         sum += item.price * item.purchaseQuantity;
    //     });
    //     return sum.toFixed(2);
    // }

    // function submitCheckout () {
    //     const productIds = [];

    //     state.shoppingBag.forEach((item) => {
    //         for (let i = 0; i < item.purchaseQuantity; i++) {
    //             productIds.push(item._id);
    //         }
    //     });

    //     getCheckout({
    //         variables: { products: productIds },
    //     });
    // }

    // if (!state.shoppingBagOpen) {
    //     return (
    //         <div className="shoppingBag-closed" onClick={toggleShoppingBag}>
    //             <span role="img" aria-label="trash">
    //                 🛒
    //             </span>
    //         </div>
    //     );
    // }

    return (
        <section className="main-content-container">
            <div className="main-content-row">
                <h3>Shopping Bag</h3>
            </div>
            <div className="main-content-row">
                <div className="wishlist-wrapper">
                    <div className="product-card-column-wrapper">
                        {!productsLoading && (
                            filterShoppingBagProducts().map((product, i) => {
                                return (
                                    <ShoppingBagProductCard
                                        key={i}
                                        _id={product._id}
                                        image={product.image}
                                        designer={product.designer.name}
                                        category={product.category.name}
                                        name={product.name}
                                        price={product.price}
                                        salePrice={getSalePrice(product.price)}
                                        color={product.color.name}
                                        onSale={product.onSale}
                                        isWishlist={true}
                                        user={user}
                                    />
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </section>

    );
};

export default ShoppingBag;