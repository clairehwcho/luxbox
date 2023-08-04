import { useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import LoginIcon from '@mui/icons-material/LoginOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import AccountIcon from '@mui/icons-material/PersonOutlineOutlined';
import RegisterIcon from '@mui/icons-material/PersonAddAlt';
import WishlistIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined';

import { QUERY_USER } from '../../../../utils/queries';
import Auth from '../../../../utils/auth';

const AccountMenu = (props) => {

    const { data } = useQuery(QUERY_USER);

    const logout = (event) => {
        event.preventDefault();
        Auth.logout();
    };

    return (
        <Fragment>
            {Auth.loggedIn()
                ? (
                    <div className="login-status-wrapper">
                        <Link to="/account/details" className="link">
                            <div className="header-nav-menu-with-icon">
                                <AccountIcon fontSize="small" className="header-nav-icon" id="profile-icon" />
                                <span>My Account</span>
                            </div>
                        </Link>
                        <div className="header-nav-menu-with-icon" onClick={logout} >
                            <LogoutIcon fontSize="small" className="header-nav-icon" id="logout-icon" />
                            <span>Sign Out</span>
                        </div>
                    </div>
                )
                : (
                    <div className="login-status-wrapper">
                        <Link to="/account/sign-in" className="link">
                            <div className="header-nav-menu-with-icon">
                                <LoginIcon fontSize="small" className="header-nav-icon" id="profile-icon" />
                                <span>Sign In</span>
                            </div>
                        </Link>
                        <Link to="/account/register" className="link">
                            <div className="header-nav-menu-with-icon">
                                <RegisterIcon fontSize="small" className="header-nav-icon" id="profile-icon" />
                                <span>Register</span>
                            </div>
                        </Link>
                    </div>
                )
            }
            < Link to="/account/wishlist" className="link" >
                <div className="header-nav-menu-with-icon">
                    <WishlistIcon fontSize="small" className="header-nav-icon" id="wishlist-icon" />
                    <span>Wishlist</span>
                </div>
            </Link >
            <Link to="/account/shopping-bag" className="link">
                <div className="header-nav-menu-with-icon">
                    <ShoppingBagIcon fontSize="small" className="header-nav-icon" id="shopping-bag-icon" />
                    <span>Shopping Bag</span>
                </div>
            </Link>
        </Fragment>
    );
};

export default AccountMenu;