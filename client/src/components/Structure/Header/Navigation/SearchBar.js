import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/SearchOutlined';

const SearchBar = (props) => {
    const [searchInput, setSearchInput] = useState("");

    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/shop/search/${searchInput}`);

        setSearchInput('');
    }

    return (
        <form className="search-form" onSubmit={handleSearchSubmit}>
            <TextField
                className="search-bar-input"
                id="input-with-icon-textfield"
                placeholder="Search"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon
                                sx={{
                                    fontSize: "20px",
                                    color: "white",
                                }}
                            />
                        </InputAdornment>
                    ),
                }}
                variant="standard"
                focused
                sx={{
                    width: "100%",
                    input: {
                        height: "0.8rem",
                        fontSize: "0.8rem",
                        color: "white",
                        borderBottom: "1px solid white",
                    },
                    "& .MuiInput-underline:after": {
                        borderBottom: "1px solid white",
                    },
                }}
                value={searchInput}
                onChange={handleSearchChange}
            />
        </form>
    );
};

export default SearchBar;