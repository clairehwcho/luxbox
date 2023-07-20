import { Link, useParams } from 'react-router-dom';

const ProductCategoryFilter = (props) => {

    return (
        <div className="product-category-filter-wrapper">
            {props.category === "clothing" && (
                <ul>
                    <li>
                        <Link to="/shop/clothing" className="link">
                            Clothing
                        </Link>
                    </li>
                    <li>
                        <Link to="/shop/shoes" className="link">
                            Shoes
                        </Link>
                    </li>
                    <li>
                        <Link to="/shop/bags" className="link">
                            Bags
                        </Link>
                    </li>
                    <li>
                        <Link to="/shop/jewelry-and-accessories" className="link">
                            Jewelry & Accessories
                        </Link>
                    </li>
                    <li>
                        <Link to="/shop/beauty" className="link">
                            Beauty
                        </Link>
                    </li>
                    <li>
                        <Link to="/shop/home" className="link">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/shop/sale" className="link">
                            Sale
                        </Link>
                    </li>
                </ul >
            )
            }
        </div>
    );
};

export default ProductCategoryFilter;