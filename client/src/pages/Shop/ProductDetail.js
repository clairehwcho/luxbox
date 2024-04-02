import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';

import { useStoreContext } from '../../utils/GlobalState';
import Auth from '../../utils/auth';

import { UPDATE_CURRENT_PRODUCT } from '../../utils/actions';
import { QUERY_USER, QUERY_PRODUCTS } from '../../utils/queries';
import { ADD_TO_SHOPPING_BAG, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../../utils/mutations';
import { formatCurrency } from '../../utils/helpers';
import NotFound from '../../components/Product/NotFound';

const ProductDetail = (props) => {
    const [currentProductState, setCurrentProductState] = useState();
    const [quantityState, setQuantityState] = useState(1)

    const { designerParam, categoryParam, nameParam } = useParams();

    const [state, dispatch] = useStoreContext();
    const { products, shoppingBag, wishlist } = state;

    const { loading: userLoading, error: userError, data: userData } = useQuery(QUERY_USER);
    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(QUERY_PRODUCTS);

    const [addToWishlist, { loading: addToWishlistLoading, error: addToWishlistError }] = useMutation(ADD_TO_WISHLIST, {
        refetchQueries: [QUERY_USER, "GetUser"]
    });

    const [addToShoppingBag, { loading: addToShoppingBagLoading, error: addToShoppingBagError }] = useMutation(ADD_TO_SHOPPING_BAG, {
        refetchQueries: [QUERY_USER, "GetUser"]
    });

    const [removeFromWishlist, { loading: removeFromWishlistLoading, error: removeFromWishlistError }] = useMutation(REMOVE_FROM_WISHLIST, {
        refetchQueries: [QUERY_USER, "GetUser"]
    });

    const user = userData?.user || {};

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
                    }
                }
                return;
            }
        } catch (error) {
            console.error(error);
        }
    }, [categoryParam, designerParam, dispatch, nameParam, productsData, wishlist]);


    // Handle Shopping bag button.
    const handleShoppingBagButtonText = () => {
        if (!Auth.loggedIn()) {
            return "Add to Bag";
        }
        else if (!userLoading) {
            if (addToShoppingBagLoading) {
                return "Adding...";
            }
            if (user.shoppingBag.includes(currentProductState._id)) {
                return "Added to Bag";
            }
            else {
                return "Add to Bag";
            }
        };
    };

    const handleShoppingBagButtonClick = async (e) => {
        e.preventDefault();

        const button = e.target;

        if (!Auth.loggedIn()) {
            return navigate("/account/sign-in");
        }

        if (button.innerText === "Add to Bag") {
            try {
                await addToShoppingBag({
                    variables: {
                        productId: currentProductState._id,
                        quantity: quantityState
                    }
                })
            }
            catch (error) {
                console.error(error);
            };
        }
        else if (button.innerText === "Added to Bag") {
        }
    }

    // Handle wishlist button.
    const handleWishlistButtonText = () => {
        if (!Auth.loggedIn()) {
            return "Add to Wishlist";
        }
        else if (!userLoading) {
            if (addToWishlistLoading) {
                return "Adding...";
            }
            if (removeFromWishlistLoading) {
                return "Removing...";
            }
            if (user.wishlist.includes(currentProductState._id)) {
                return "Remove from Wishlist";
            }
            else {
                return "Add to Wishlist";
            }
        };
    };

    const handleWishlistButtonClick = async (e) => {
        e.preventDefault();

        const button = e.target;

        if (!Auth.loggedIn()) {
            return navigate("/account/sign-in");
        }

        if (button.innerText === "Add to Wishlist") {
            try {
                await addToWishlist({
                    variables: {
                        productId: currentProductState._id
                    }
                })
            }
            catch (error) {
                console.error(error);
            };
        }
        else if (button.innerText === "Remove from Wishlist") {
            try {
                await removeFromWishlist({
                    variables: {
                        productId: currentProductState._id
                    }
                })
            }
            catch (error) {
                console.error(error);
            };
        }
    }

    const getSalePrice = (price) => {
        return (Math.ceil(price * 0.8));
    };

    // Handle quantity input
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
                                <button className="filled-btn" onClick={handleShoppingBagButtonClick}>
                                    {handleShoppingBagButtonText()}
                                </button>
                                <button className="outlined-btn" onClick={handleWishlistButtonClick}>
                                    {handleWishlistButtonText()}
                                </button>
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