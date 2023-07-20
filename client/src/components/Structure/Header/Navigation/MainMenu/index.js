import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';

const MainMenu = (props) => {
    const [bgColor, setBgColor] = useState("white");

    useEffect(() => {
        document.getElementById("app").style.backgroundColor = bgColor;
    }, [bgColor]);

    const openSideNav = () => {
        document.getElementById("main-menu").style.width = "250px";
        setBgColor("rgba(0,0,0,0.4)");
    };

    const closeSideNav = () => {
        document.getElementById("main-menu").style.width = "0";
        setBgColor("white");
    };

    return (
        <div className="main-menu-wrapper">
            <ul className="main-menu" id="main-menu">
                <li>
                    <Link to={undefined} className="menu-close-btn link" onClick={closeSideNav}>&times;</Link>
                </li>
                <li>
                    <Link to="/shop/new-in" className="link" onClick={closeSideNav}>New In</Link>
                </li>
                <li>
                    <Link to="/shop/designers" className="link" onClick={closeSideNav}>Designers</Link>
                </li>
                <li>
                    <Link to="/shop/clothing" className="link" onClick={closeSideNav}>Clothing</Link>
                </li>
                <li>
                    <Link to="/shop/shoes" className="link" onClick={closeSideNav}>Shoes</Link>
                </li>
                <li>
                    <Link to="/shop/bags" className="link" onClick={closeSideNav}>Bags</Link>
                </li>
                <li>
                    <Link to="/shop/jewelry-and-accessories" className="link" onClick={closeSideNav}>Jewelry & Accessories</Link>
                </li>
                <li>
                    <Link to="/shop/beauty" className="link" onClick={closeSideNav}>Beauty</Link>
                </li>
                <li>
                    <Link to="/shop/home" className="link" onClick={closeSideNav}>Home</Link>
                </li>
                <li>
                    <Link to="/shop/sale" className="link" onClick={closeSideNav}>Sale</Link>
                </li>
            </ul>
            <MenuIcon id="collapsible-menu-icon" onClick={openSideNav} />
        </div >
    );
};

export default MainMenu;