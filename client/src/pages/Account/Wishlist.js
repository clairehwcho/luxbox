import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { useStoreContext } from "../../utils/GlobalState";
import ProductCard from "../../components/Product/ProductCard";

import { QUERY_USER, QUERY_PRODUCTS } from "../../utils/queries";
import Auth from "../../utils/auth";
import { idbPromise } from "../../utils/helpers";

const Wishlist = () => {
    const navigate = useNavigate();

    const { data: userData, loading: userLoading } = useQuery(QUERY_USER);
    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(QUERY_PRODUCTS);

    const wishlist = userData?.user.wishlist || {};
    const allProducts = productsData?.products || {};

    const filterWishlistProducts = () => {
        if (wishlist !== undefined && wishlist.length > 0) {
            if (allProducts !== undefined) {
                return allProducts.filter((product) => wishlist.includes(product._id))
            }
        }
    }

    useEffect(() => {
        if (!Auth.loggedIn()) {
            return navigate("/account/sign-in");
        }
    }, [navigate]);

    const getSalePrice = (price) => {
        return (Math.ceil(price * 0.8));
    };

    return (
        <section className="main-content-container">
            <div className="main-content-row">
                <h3>Wishlist</h3>
            </div>
            <div className="main-content-row">
                <div className="wishlist-wrapper">
                    <div className="product-card-column-wrapper">
                        {!productsLoading && (
                            filterWishlistProducts().map((product, i) => {
                                return (
                                    <ProductCard
                                        key={i}
                                        image={product.image}
                                        designer={product.designer.name}
                                        category={product.category.name}
                                        name={product.name}
                                        price={product.price}
                                        salePrice={getSalePrice(product.price)}
                                        color={product.color.name}
                                        onSale={product.onSale}
                                        isWishlist={true}
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

export default Wishlist;