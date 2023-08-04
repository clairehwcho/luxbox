import { Link } from 'react-router-dom';
import justLandedImg from '../assets/img/homepage/just-landed.jpg';
import clothingImg from '../assets/img/homepage/clothing.jpg';
import shoesImg from '../assets/img/homepage/shoes.jpg';
import bagsImg from '../assets/img/homepage/bags.jpg';
import jewelryAndAccessoriesImg from '../assets/img/homepage/jewelry-and-accessories.jpg';
import beautyImg from '../assets/img/homepage/beauty.jpg';
import homeImg from '../assets/img/homepage/home.jpg';

const Home = (props) => {
    return (
        <section className="home-content-container">
            <div className="home-content-row">
                <div className="just-landed">
                    <img src={justLandedImg} alt="just landed"></img>
                    <div className="just-landed-text">
                        <h1>Just Landed</h1>
                        <p>The summer 2023 collection</p>
                        <Link to="/shop/new-in" className="link">
                            <button id="just-landed-shop-now-button">
                                Shop now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="home-content-row">
                <div className="product-category-wrapper">
                    <Link to="/shop/clothing" className="link">
                        <div className="product-category">
                            <img src={clothingImg} alt="shop clothing"></img>
                            <h4>Clothing</h4>
                        </div>
                    </Link>
                    <Link to="/shop/shoes" className="link">
                        <div className="product-category">
                            <img src={shoesImg} alt="shop shoes"></img>
                            <h4>Shoes</h4>
                        </div>
                    </Link>
                    <Link to="/shop/bags" className="link">
                        <div className="product-category">
                            <img src={bagsImg} alt="shop bags"></img>
                            <h4>Bags</h4>
                        </div>
                    </Link>
                    <Link to="/shop/jewelry-and-accessories" className="link">
                        <div className="product-category">
                            <img src={jewelryAndAccessoriesImg} alt="shop jewelry and accessories"></img>
                            <h4>Jewelry & Accessories</h4>
                        </div>
                    </Link>
                    <Link to="/shop/beauty" className="link">
                        <div className="product-category">
                            <img src={beautyImg} alt="shop beauty"></img>
                            <h4>Beauty</h4>
                        </div>
                    </Link>
                    <Link to="/shop/home" className="link">
                        <div className="product-category">
                            <img src={homeImg} alt="shop home"></img>
                            <h4>Home</h4>
                        </div>
                    </Link>
                </div >
            </div >
        </section >
    );
};

export default Home;