import { Link } from 'react-router-dom';

const Footer = (props) => {
    return (
        <footer>
            <ul>
                <li>© 2023 LuxBox</li>
                <li>
                    <Link to="/support/contact-us" className="link">
                        Contact Us
                    </Link>
                </li>

            </ul>
        </footer>
    );
};

export default Footer;