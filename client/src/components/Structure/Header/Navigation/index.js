import { Link } from 'react-router-dom';

import MainMenu from './MainMenu';
import AccountMenu from './AccountMenu';
import SearchBar from './SearchBar';

const Navigation = (props) => {
    return (
        <nav className="header-nav">
            <div className="header-nav-row">
                <div className="collapsible-main-menu-wrapper">
                    <MainMenu />
                </div>
                <div className="logo-wrapper">
                    <Link to="/" className="link">
                        <h1>LuxBox</h1>
                    </Link>
                </div>
                <div className="header-account-menu-wrapper">
                    <AccountMenu />
                </div>
            </div>
            <div className="header-nav-row">
                <div className="horizontal-main-menu-wrapper">
                    <MainMenu />
                </div>
                <div className="search-bar-wrapper">
                    <SearchBar />
                </div>
            </div>
        </nav >
    );
};

export default Navigation;