import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useStoreContext } from "../../utils/GlobalState";
import ProductCard from "../../components/Product/ProductCard";

import Auth from "../../utils/auth";
import { idbPromise } from "../../utils/helpers";

const Wishlist = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useStoreContext();
    const { wishlist } = state;


    useEffect(() => {
        if (!Auth.loggedIn()) {
            return navigate("/account/sign-in");
        }
    }, [navigate]);

    const getSalePrice = (price) => {
        return (Math.ceil(price * 0.8));
    };

    useEffect(() => {
        idbPromise("wishlist", "get");
        console.log(wishlist);
    })

    return (
        <section className="main-content-container">
            <div className="main-content-row">
                <h3>Wishlist</h3>
            </div>
            <div className="main-content-row">
                {wishlist.length > 1
                    ? (wishlist.map((product, i) => {
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
                            />
                        )
                    }))
                    : (
                        <p>Your wishlist is currently empty.</p>
                    )}
            </div>
        </section>
    );
};

export default Wishlist;