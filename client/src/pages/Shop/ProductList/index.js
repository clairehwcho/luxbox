import { useEffect, Fragment, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../../utils/GlobalState';
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    UPDATE_DESIGNERS,
    UPDATE_CURRENT_DESIGNER,
    UPDATE_COLORS,
    UPDATE_CURRENT_COLOR
} from '../../../utils/actions';
import {
    QUERY_PRODUCTS,
    QUERY_CATEGORIES,
    QUERY_DESIGNERS,
    QUERY_COLORS
} from '../../../utils/queries';
import { idbPromise, formatCategoryName, flattenObj } from '../../../utils/helpers';

import ProductCard from '../../../components/Product/ProductCard';
import NotFound from '../../../components/Product/NotFound';

import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NativeSelect from '@mui/material/NativeSelect';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const ProductList = (props) => {

    const [sortState, setSortState] = useState('test');
    console.log(sortState);

    const { categoryParam, searchInputParam, designerParam, colorParam } = useParams();

    let formattedDesignerName;

    if (designerParam) {
        formattedDesignerName = designerParam.replace("%20", " ");
    };

    const [state, dispatch] = useStoreContext();

    const { currentCategory, currentDesigner, currentColor } = state;

    const { loading, data: productData } = useQuery(QUERY_PRODUCTS);
    const { data: categoryData } = useQuery(QUERY_CATEGORIES);
    const { data: colorData } = useQuery(QUERY_COLORS);

    useEffect(() => {
        if (categoryData) {
            dispatch({
                type: UPDATE_CATEGORIES,
                categories: categoryData.categories,
            });
            categoryData.categories.forEach((category) => {
                idbPromise('categories', 'put', category);

                if (category.name === categoryParam) {
                    dispatch({
                        type: UPDATE_CURRENT_CATEGORY,
                        currentCategory: category._id,
                    });
                }
            });
        } else if (!loading) {
            idbPromise('categories', 'get').then((categories) => {
                dispatch({
                    type: UPDATE_CATEGORIES,
                    categories: categories,
                });
            });
        }
    }, [categoryData, loading, dispatch, categoryParam]);

    useEffect(() => {
        if (colorData) {
            dispatch({
                type: UPDATE_COLORS,
                colors: colorData.colors,
            });
            colorData.colors.forEach((color) => {
                idbPromise('colors', 'put', color);

                if (color.name === colorParam) {
                    dispatch({
                        type: UPDATE_CURRENT_CATEGORY,
                        currentCategory: color._id,
                    });
                }
            });
        } else if (!loading) {
            idbPromise('colors', 'get').then((colors) => {
                dispatch({
                    type: UPDATE_COLORS,
                    colors: colors,
                });
            });
        }
    }, [colorData, loading, dispatch, colorParam]);

    useEffect(() => {
        if (productData) {
            dispatch({
                type: UPDATE_PRODUCTS,
                products: productData.products,
            });
            productData.products.forEach((product) => {
                idbPromise('products', 'put', product);
            });
        } else if (!loading) {
            idbPromise('products', 'get').then((products) => {
                dispatch({
                    type: UPDATE_PRODUCTS,
                    products: products,
                });
            });
        }
    }, [productData, loading, dispatch]);




    // const sortMethods = {
    //     none: { method: (a, b) => null },
    //     newest: { method: (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt) },
    //     priceHighToLow: { method: (a, b) => parseInt(b.price) - parseInt(a.price) },
    //     priceLowToHigh: { method: (a, b) => parseInt(a.price) - parseInt(b.price) },
    // }

    // console.log(sortState);
    // useEffect(() => {
    //     if (sortState !== 'none'){
    //         return state.products.sort(sortMethods[sortState].method);
    //     }

    // })

    const filterProducts = () => {
        if (props.category === "New In") {
            return state.products;
        }
        else if (props.category === "Sale") {
            return state.products.filter((product) => product.onSale === true);
        }
        else if (searchInputParam) {
            const searchWordsArr = searchInputParam.trim().toLowerCase().split(" ");

            return state.products.filter((product) => {
                const flattenedProductObj = flattenObj(product);
                const productValsArr = Object.values(flattenedProductObj);

                return searchWordsArr.every(searchWord => productValsArr.includes(searchWord));
            });
        }
        else if (designerParam) {
            return state.products.filter((product) => product.designer.name === formattedDesignerName);
        }
        return state.products.filter((product) => product.category._id === currentCategory);
    }


    // const handleSortChange = (e) => {
    //     setSortState(e.target.value)
    //     console.log(sortState);

    //     const sortProducts = (a, b) => {
    //         switch (sortState) {
    //             case "newest":
    //                 return parseInt(b.createdAt) - parseInt(a.createdAt);
    //             case "price-high-to-low":
    //                 return parseInt(b.price) - parseInt(a.price);
    //             case "price-low-to-high":
    //                 return parseInt(a.price) - parseInt(b.price);
    //             default:
    //                 break;
    //         }
    //     }

    //     return state.products.sort((a, b) => sortProducts);
    // }

    const getSalePrice = (price) => {
        return (Math.ceil(price * 0.8));
    };

    return (
        <section className="main-content-container">
            <div className="main-content-row">
                <h3>
                    {searchInputParam && `Search Results for "${searchInputParam}"`}
                    {designerParam && `Designer: ${formattedDesignerName}`}
                    {props.category
                        ? props.category
                        : formatCategoryName(categoryParam)
                    }
                </h3>
            </div>
            <div className="main-content-row">
                {state.products
                    ? (
                        <Fragment>
                            <div className="product-filter-and-sort-wrapper">
                                <div className="product-filter-wrapper">
                                    <div className="collapsible-product-filter">
                                        <FilterListIcon /><span>Filter</span>
                                    </div>
                                    <span className="product-result-num"> {filterProducts().length} Results </span>
                                </div>
                                <div className="product-sort-wrapper">
                                    <NativeSelect
                                        defaultValue="Sort By"
                                        inputProps={{
                                            id: 'uncontrolled-native',
                                        }}
                                        sx={{
                                            width: "fit-content",
                                            fontSize: "0.9rem",
                                            textAlign: "center",
                                            "& .MuiNativeSelect-select:after": {
                                                borderBottom: "1px solid white",
                                            },
                                        }}
                                        onChange={(e) => setSortState(e.target.value)}
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="priceHighToLow">Price High to Low</option>
                                        <option value="priceLowToHigh">Price Low to High</option>
                                    </NativeSelect>
                                </div>
                            </div>
                            <div className="product-list-wrapper">
                                <div className="side-product-filter-wrapper">
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <p>CATEGORY</p>
                                        </AccordionSummary>
                                        <AccordionDetails>
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
                                            </ul>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                            <p>DESIGNER</p>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <p>
                                            </p>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel3a-content"
                                            id="panel3a-header"
                                        >
                                            <p>COLOR</p>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <p>
                                            </p>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                                {filterProducts().length > 0
                                    ? (<div className="product-card-column-wrapper">
                                        {filterProducts().map((product, i) => {
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
                                        })}
                                    </div>
                                    )
                                    : <NotFound />
                                }
                            </div >
                        </Fragment>
                    )
                    : (
                        <Fragment>
                            <div className="main-content-row">
                                <p>Something went wrong. Try again.</p>
                            </div>
                        </Fragment>
                    )
                }
            </div>
        </section >
    );
};

export default ProductList;