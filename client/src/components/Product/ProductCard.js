import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REMOVE_FROM_WISHLIST } from "../../utils/mutations";
import { QUERY_USER } from "../../utils/queries";
import { formatCurrency } from "../../utils/helpers";

const ProductCard = (props) => {
    const [removeFromWishlist, { loading: removeFromWishlistLoading, error: removeFromWishlistError }] = useMutation(REMOVE_FROM_WISHLIST, {
        refetchQueries: [QUERY_USER, "GetUser"]
    });

    const handleRemoveFromWishlistButtonClick = async () => {
        try {
            await removeFromWishlist({
                variables: {
                    wishlist: props._id
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
                            <button className="filled-btn">
                                Add to Bag
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