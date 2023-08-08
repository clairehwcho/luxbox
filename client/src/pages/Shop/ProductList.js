import { useEffect, Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { useStoreContext } from "../../utils/GlobalState.js";
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
} from "../../utils/actions.js";
import {
    QUERY_PRODUCTS,
    QUERY_CATEGORIES,
    QUERY_SUBCATEGORIES,
} from "../../utils/queries.js";
import { idbPromise, formatCategoryName, flattenObj } from "../../utils/helpers.js";

import ProductCard from "../../components/Product/ProductCard.js";
import ProductCategoryFilter from "../../components/Product/ProductCategoryFilter.js";
import NotFound from "../../components/Product/NotFound.js";

import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NativeSelect from "@mui/material/NativeSelect";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const ProductList = (props) => {
    const [sortState, setSortState] = useState("newest");
    const [productFilterMenuWidthState, setProductFilterMenuWidthState] = useState("0");
    const [expandedState, setExpandedState] = useState("false");

    // Declare state and dispatch using array destructuring.
    const [state, dispatch] = useStoreContext();
    const { currentCategory, currentSubcategory } = state;

    // Get the params from the URL.
    const { categoryParam, subcategoryParam, searchInputParam, designerParam } = useParams();

    // Handle designer name.
    let formattedDesignerName;

    if (designerParam) {
        formattedDesignerName = designerParam.replace("%20", " ");
    };

    // The useQuery hook returns an object from Apollo Client that contains loading, error, and data properties that can be used to render UI.
    const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery(QUERY_CATEGORIES);
    const { loading: subcategoriesLoading, error: subcategoriesError, data: subcategoriesData } = useQuery(QUERY_SUBCATEGORIES);
    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(QUERY_PRODUCTS);


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

    // Get products.
    useEffect(() => {
        try {
            if (productsData) {
                dispatch({
                    type: UPDATE_PRODUCTS,
                    payload: productsData.products,
                });
                productsData.products.forEach((product) => {
                    idbPromise("products", "put", product);
                    // eslint-disable-next-line default-case
                    switch (product.category.name) {
                        case "clothing":
                            dispatch({
                                type: UPDATE_CLOTHING_SUBCATEGORIES,
                                payload: product.subcategory._id
                            });
                            idbPromise("clothingSubcategories", "put", product.subcategory);
                            break;
                        case "shoes":
                            dispatch({
                                type: UPDATE_SHOES_SUBCATEGORIES,
                                payload: product.subcategory._id
                            });
                            idbPromise("shoesSubcategories", "put", product.subcategory);
                            break;
                        case "bags":
                            dispatch({
                                type: UPDATE_BAGS_SUBCATEGORIES,
                                payload: product.subcategory._id
                            });
                            idbPromise("bagsSubcategories", "put", product.subcategory);
                            break;
                        case "jewelry-and-accessories":
                            dispatch({
                                type: UPDATE_JEWELRY_AND_ACCESSORIES_SUBCATEGORIES,
                                payload: product.subcategory._id
                            });
                            idbPromise("jewelryAndAccessoriesSubcategories", "put", product.subcategory);
                            break;
                        case "beauty":
                            dispatch({
                                type: UPDATE_BEAUTY_SUBCATEGORIES,
                                payload: product.subcategory._id
                            });
                            idbPromise("beautySubcategories", "put", product.subcategory);
                            break;
                        case "home":
                            dispatch({
                                type: UPDATE_HOME_SUBCATEGORIES,
                                payload: product.subcategory._id
                            });
                            idbPromise("homeSubcategories", "put", product.subcategory);
                            break;
                    }
                })
            } else if (!productsLoading) {
                idbPromise("products", "get").then((products) => {
                    dispatch({
                        type: UPDATE_PRODUCTS,
                        payload: products,
                    });
                });
            } else if (productsError) {
                console.error(productsError);
            }
        } catch (error) {
            console.error(error);
        }
    }, [productsData, productsLoading, productsError, dispatch]);

    // Handle sorting.
    const handleSortChange = (e) => {
        setSortState(e.target.value);
    }

    // Filter products
    const filterProducts = () => {
        if (categoryParam === "new-in") {
            switch (sortState) {
                case "newest":
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt));
                case "price-high-to-low":
                    return state.products.sort((a, b) => parseInt(b.price) - parseInt(a.price));
                case "price-low-to-high":
                    return state.products.sort((a, b) => a.price - b.price);
                default:
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt));
            }
        }
        else if (categoryParam === "sale") {
            const isCurrentSubcategoryAndOnSale = (product) => {
                if (subcategoryParam) {
                    return product.category.name === subcategoryParam && product.onSale === true;
                }
                return product.onSale === true;
            };

            switch (sortState) {
                case "newest":
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter(isCurrentSubcategoryAndOnSale);
                case "price-high-to-low":
                    return state.products.sort((a, b) => parseInt(b.price) - parseInt(a.price)).filter(isCurrentSubcategoryAndOnSale);
                case "price-low-to-high":
                    return state.products.sort((a, b) => parseInt(a.price) - parseInt(b.price)).filter(isCurrentSubcategoryAndOnSale);
                default:
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter(isCurrentSubcategoryAndOnSale);
            }
        }
        else if (searchInputParam) {
            const includesSearchWord = (product) => {
                const searchWordsArr = searchInputParam.trim().toLowerCase().split(" ");
                const flattenedProductObj = flattenObj(product);
                const productValsArr = Object.values(flattenedProductObj);

                if (categoryParam) {
                    return product.category.name === categoryParam && searchWordsArr.every(searchWord => productValsArr.includes(searchWord));
                }
                return searchWordsArr.every(searchWord => productValsArr.includes(searchWord));
            }

            switch (sortState) {
                case "newest":
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter(includesSearchWord);
                case "price-high-to-low":
                    return state.products.sort((a, b) => parseInt(b.price) - parseInt(a.price)).filter(includesSearchWord);
                case "price-low-to-high":
                    return state.products.sort((a, b) => a.price - b.price).filter(includesSearchWord);
                default:
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter(includesSearchWord);
            }
        }
        else if (designerParam) {
            switch (sortState) {
                case "newest":
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter((product) => product.designer.name === formattedDesignerName);
                case "price-high-to-low":
                    return state.products.sort((a, b) => parseInt(b.price) - parseInt(a.price)).filter((product) => product.designer.name === formattedDesignerName);
                case "price-low-to-high":
                    return state.products.sort((a, b) => a.price - b.price).filter((product) => product.designer.name === formattedDesignerName);
                default:
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter((product) => product.designer.name === formattedDesignerName);
            }
        }
        else if (subcategoryParam) {
            const isCurrentSubcategory = (product) => {
                return (product.category._id === currentCategory) && (product.subcategory._id === currentSubcategory)
            };

            switch (sortState) {
                case "newest":
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter(isCurrentSubcategory);
                case "price-high-to-low":
                    return state.products.sort((a, b) => parseInt(b.price) - parseInt(a.price)).filter(isCurrentSubcategory);
                case "price-low-to-high":
                    return state.products.sort((a, b) => parseInt(a.price) - parseInt(b.price)).filter(isCurrentSubcategory);
                default:
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter(isCurrentSubcategory);
            }
        }
        else {
            const isCurrentCategory = (product) => {
                return product.category._id === currentCategory
            };

            switch (sortState) {
                case "newest":
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter(isCurrentCategory);
                case "price-high-to-low":
                    return state.products.sort((a, b) => parseInt(b.price) - parseInt(a.price)).filter(isCurrentCategory);
                case "price-low-to-high":
                    return state.products.sort((a, b) => parseInt(a.price) - parseInt(b.price)).filter(isCurrentCategory);
                default:
                    return state.products.sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)).filter(isCurrentCategory);
            }
        }
    }

    // Get sale price of products.
    const getSalePrice = (price) => {
        return (Math.ceil(price * 0.8));
    };

    // Handle collapsible product filter menu for smaller-size screen.
    const handleFilterMenuChange = (panel) => (event, isExpanded) => {
        setExpandedState(isExpanded ? panel : false);
    };

    const openProductFilterMenu = () => {
        setProductFilterMenuWidthState("100%");
    }

    const closeProductFilterMenu = () => {
        setProductFilterMenuWidthState("0");
    }

    useEffect(() => {
        document.getElementById("collapsible-product-filter-menu-wrapper").style.width = productFilterMenuWidthState;
    }, [productFilterMenuWidthState]);

    // Render a proper heading on main content row.
    const renderMainContentRowHeading = () => {
        if (searchInputParam) {
            return `Search Results for "${searchInputParam}"`;
        }
        else if (designerParam) {
            return `Designer: ${formattedDesignerName}`;
        }
        else if (categoryParam) {
            return formatCategoryName(categoryParam);
        };
    }

    return (
        <section className="main-content-container">
            <div className="main-content-row">
                <h3>{renderMainContentRowHeading()}</h3>
            </div>
            <div className="main-content-row">
                {state.products
                    ? (
                        <Fragment>
                            <div className="product-filter-and-sort-wrapper">
                                <div className="product-filter-wrapper">
                                    <div id="collapsible-product-filter-menu-wrapper">
                                        <Accordion disableGutters={true}>
                                            <AccordionSummary>
                                                <Typography
                                                    sx={{
                                                        width: "100%"
                                                    }}
                                                >
                                                    FILTER
                                                </Typography>
                                                <CloseIcon onClick={closeProductFilterMenu} />
                                            </AccordionSummary>
                                        </Accordion>
                                        <Accordion
                                            disableGutters={true}
                                            expanded={expandedState === "panel1"}
                                            onChange={handleFilterMenuChange("panel1")}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography>CATEGORY</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <ProductCategoryFilter />
                                            </AccordionDetails>
                                        </Accordion>
                                        <div className="product-filter-button-wrapper">
                                            <button className="outlined-btn">Clear All</button>
                                            <button className="filled-btn">Apply</button>
                                        </div>
                                    </div>
                                    <div className="product-filter-icon-wrapper" onClick={openProductFilterMenu}>
                                        <FilterListIcon /><span>Filter</span>
                                    </div>
                                    <span className="product-result-num"> {filterProducts().length} Results </span>
                                </div>
                                <div className="product-sort-wrapper">
                                    <NativeSelect
                                        inputProps={{
                                            id: "uncontrolled-native",
                                        }}
                                        sx={{
                                            width: "fit-content",
                                            fontSize: "0.9rem",
                                            textAlign: "center",
                                            "& .MuiNativeSelect-select:after": {
                                                borderBottom: "1px solid white",
                                            },
                                        }}
                                        onChange={handleSortChange}
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price-high-to-low">Price High to Low</option>
                                        <option value="price-low-to-high">Price Low to High</option>
                                    </NativeSelect>
                                </div>
                            </div>
                            <div className="product-list-wrapper">
                                <div className="product-filter-menu-wrapper">
                                    <Accordion
                                        disableGutters={true}
                                        expanded={expandedState === "panel1"}
                                        onChange={handleFilterMenuChange("panel1")}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>CATEGORY</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ProductCategoryFilter />
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