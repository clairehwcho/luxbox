import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';

const ProductCard = (props) => {
    return (
        <Link to={`/shop/product/${props.designer}/${props.category}/${props.name}`} className="link" >
            <div className="product-card-column">
                <div className="product-card">
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
                    {props.isWishlist && (
                        <div className="product-card-footer">
                            <div className="product-detail-button-wrapper">
                                <button className="filled-btn">
                                    Add to Bag
                                </button>
                                <button className="outlined-btn">
                                    Remove from Wishlist
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </Link >
    )
};

export default ProductCard;