import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const ProductCategoryFilter = (props) => {
    const [subcategoryState, setSubcategoryState] = useState("");
    const [subcategoryChangedState, setSubcategoryChangedState] = useState(false);

    const { searchInputParam, categoryParam } = useParams();


    const navigate = useNavigate();

    const handleSubcategoryStateChange = (e) => {
        setSubcategoryState(e.target.value);
        setSubcategoryChangedState(true);
    }

    useEffect(() => {
        if (subcategoryChangedState === true) {
            if (categoryParam === "new-in") {
                navigate(`/shop/${subcategoryState}`);
            }
            else if (searchInputParam) {
                navigate(`/shop/search/${searchInputParam}/${subcategoryState}`);
            }
            else {
                navigate(`/shop/${categoryParam}/${subcategoryState}`);
            }
            setSubcategoryChangedState(false);
        };
    }, [subcategoryChangedState, navigate, categoryParam, subcategoryState, searchInputParam]);


    const categoryFilterOptions = {
        clothing: [
            { value: "", label: "All" },
            { value: "coats", label: "Coats" },
            { value: "dresses", label: "Dresses" },
            { value: "jackets", label: "Jackets" },
            { value: "skirts", label: "Skirts" }
        ],
        shoes: [
            { value: "", label: "All" },
            { value: "boots", label: "Boots" },
            { value: "heels", label: "Heels" },
            { value: "loafers", label: "Loafers" },
            { value: "mules", label: "Mules" },
            { value: "sandals", label: "Sandals" }
        ],
        bags: [
            { value: "", label: "All" },
            { value: "clutch-bags", label: "Clutch bags" },
            { value: "cross-body-bags", label: "Cross-body bags" },
            { value: "shoulder-bags", label: "Shoulder bags" },
            { value: "tote-bags", label: "Tote bags" }
        ],
        jewelryAndAccessories: [
            { value: "", label: "All" },
            { value: "bracelets", label: "Bracelets" },
            { value: "brooches", label: "Brooches" },
            { value: "earrings", label: "Earrings" },
            { value: "necklaces", label: "Necklaces" },
            { value: "watches", label: "Watches" }
        ],
        beauty: [
            { value: "", label: "All" },
            { value: "bath-and-body", label: "Bath and body" },
            { value: "fragrance", label: "Fragrance" },
            { value: "home-fragrance", label: "Home fragrance" },
            { value: "makeup", label: "Makeup" },
            { value: "skincare", label: "Skincare" },
            { value: "tools-and-devices", label: "Tools and devices" },
            { value: "wellness", label: "Wellness" }
        ],
        home: [
            { value: "", label: "All" },
            { value: "art-and-prints", label: "Art and prints" },
            { value: "bowls", label: "Bowls" },
            { value: "candles", label: "Candles" },
            { value: "jewelry-cases", label: "Jewelry cases" },
            { value: "tableware", label: "Tableware" },
            { value: "throws", label: "Throws" },
            { value: "vases", label: "Vases" }
        ],
        newIn: [
            { value: "", label: "All" },
            { value: "clothing", label: "Clothing" },
            { value: "shoes", label: "Shoes" },
            { value: "bags", label: "Bags" },
            { value: "jewelry-and-accessories", label: "Jewelry and accessories" },
            { value: "beauty", label: "Beauty" },
            { value: "home", label: "Home" },
            { value: "sale", label: "Sale" }
        ],
        sale: [
            { value: "", label: "All" },
            { value: "clothing", label: "Clothing" },
            { value: "shoes", label: "Shoes" },
            { value: "bags", label: "Bags" },
            { value: "jewelry-and-accessories", label: "Jewelry and accessories" },
            { value: "beauty", label: "Beauty" },
            { value: "home", label: "Home" },
        ]
    };

    const renderCategoryOptions = () => {
        switch (categoryParam) {
            case "clothing":
                return categoryFilterOptions.clothing;
            case "shoes":
                return categoryFilterOptions.shoes;
            case "bags":
                return categoryFilterOptions.bags;
            case "jewelry-and-accessories":
                return categoryFilterOptions.jewelryAndAccessories;
            case "beauty":
                return categoryFilterOptions.beauty;
            case "home":
                return categoryFilterOptions.home;
            case "new-in":
                return categoryFilterOptions.newIn;
            case "sale":
                return categoryFilterOptions.sale;
            default:
                return categoryFilterOptions.newIn;
        }
    }

    return (
        <div className="product-category-filter-wrapper">
            <FormControl>
                <RadioGroup
                    value={subcategoryState}
                    onChange={handleSubcategoryStateChange}
                >
                    {renderCategoryOptions().map((option, i) => {
                        return (
                            <FormControlLabel key={i} value={option.value} control={<Radio size="small" color="default" />} label={option.label} />
                        )
                    })}
                </RadioGroup>
            </FormControl>
        </div>
    );
};

export default ProductCategoryFilter;