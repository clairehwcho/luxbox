import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { ADD_TO_SHOPPING_BAG, REMOVE_FROM_WISHLIST } from "../../utils/mutations";
import { QUERY_USER } from "../../utils/queries";
import { formatCurrency } from "../../utils/helpers";

const ProductCard = (props) => {
    const [addToShoppingBag, { loading: addToShoppingBagLoading, error: addToShoppingBagError }] = useMutation(ADD_TO_SHOPPING_BAG, {
        refetchQueries: [QUERY_USER, "GetUser"]
    });
    const [removeFromWishlist, { loading: removeFromWishlistLoading, error: removeFromWishlistError }] = useMutation(REMOVE_FROM_WISHLIST, {
        refetchQueries: [QUERY_USER, "GetUser"]
    });

    // Handle Shopping bag button.
    const handleShoppingBagButtonText = () => {
        if (addToShoppingBagLoading) {
            return "Adding...";
        }
        else {
            return "Add to Bag";
        }
    };

    const handleShoppingBagButtonClick = async (e) => {
        e.preventDefault();

        const button = e.target;

        if (button.innerText === "Add to Bag") {
            try {
                await addToShoppingBag({
                    variables: {
                        productId: props._id
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

    const handleRemoveFromWishlistButtonClick = async () => {
        try {
            await removeFromWishlist({
                variables: {
                    productId: props._id
                }
            })
        }
        catch (error) {
            console.error(error);
        };

    }

    return (
        <div className="product-card-column">
            <div className="product-card">
                <Link to={`/shop/product/${props.designer}/${props.category}/${props.name}`} className="link" >
                    <div className="product-card-header">
                        <img src={require(`../../assets/img/products/${props.category}/${props.image}.png`)} alt={props.name} />
                    </div>
                    <div className="product-card-body">
                        <p className="product-card-designer">
                            {props.designer}
                        </p>
                        <p className="product-card-name">
                            {props.name}
                        </p>
                        <div className="product-card-price">
                            {props.onSale === true
                                ? (
                                    <div className="sale-price-wrapper">
                                        <span className="original-price">{formatCurrency(props.price)}</span>
                                        <span className="sale-price">{formatCurrency(props.salePrice)}</span>
                                    </div>
                                )
                                : formatCurrency(props.price)
                            }
                        </div>
                    </div>
                </Link >
                {props.isWishlist && (
                    <div className="product-card-footer">
                        <div className="product-detail-button-wrapper">
                            <button className="filled-btn" onClick={handleShoppingBagButtonClick}>
                                {handleShoppingBagButtonText()}
                            </button>
                            <button className="outlined-btn" onClick={handleRemoveFromWishlistButtonClick}>
                                Remove from Wishlist
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
};

export default ProductCard;