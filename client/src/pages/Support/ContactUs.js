import { Link } from 'react-router-dom';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

import EmailForm from '../../components/Forms/EmailForm';

const ContactUs = (props) => {
    return (
        <section className="main-content-container">
            <div className="main-content-row">
                <h3>Contact Us</h3>
            </div>
            <div className="main-content-row">
                <div className="contact-us-wrapper">
                    <div className="contact-info-wrapper">
                        <p>For any enquiries please contact us. We're available 24 hours, 7 days a week.</p>
                        <div className="developer-info">
                            <p>Claire Hyung Won Cho</p>
                            <div className="developer-link">
                                <Link to="https://github.com/clairehwcho" target="_blank" className="link">
                                    <GitHubIcon />
                                </Link>
                                <Link to="https://www.linkedin.com/in/hyungwoncho/" target="_blank" className="link">
                                    <LinkedInIcon />
                                </Link>
                                <Link to="mailto:claire.hw.cho@gmail.com" className="link">
                                    <EmailIcon />
                                </Link>
                            </div>
                        </div>
                        <div className="developer-info">
                            <p>Edgar Vargas</p>
                            <div className="developer-link">
                                <Link to="https://github.com/e-varg24" target="_blank" className="link">
                                    <GitHubIcon />
                                </Link>
                                <Link to="" target="_blank" className="link">
                                    <LinkedInIcon />
                                </Link>
                                <Link to="" className="link">
                                    <EmailIcon />
                                </Link>
                            </div>
                        </div>
                        <div className="developer-info">
                            <p>Faye Hong</p>
                            <div className="developer-link">
                                <Link to="https://github.com/hong-f" target="_blank" className="link">
                                    <GitHubIcon />
                                </Link>
                                <Link to="" target="_blank" className="link">
                                    <LinkedInIcon />
                                </Link>
                                <Link to="" className="link">
                                    <EmailIcon />
                                </Link>
                            </div>
                        </div>
                        <div className="developer-info">
                            <p>Louis Kim</p>
                            <div className="developer-link">
                                <Link to="https://github.com/louiskgkim" target="_blank" className="link">
                                    <GitHubIcon />
                                </Link>
                                <Link to="https://www.linkedin.com/in/louiskgkim/" target="_blank" className="link">
                                    <LinkedInIcon />
                                </Link>
                                <Link to="Lkgk31@gmail.com" className="link">
                                    <EmailIcon />
                                </Link>
                            </div>
                        </div>
                        <div className="developer-info">
                            <p>Jordon Lor</p>
                            <div className="developer-link">
                                <Link to="https://github.com/JordonLo" target="_blank" className="link">
                                    <GitHubIcon />
                                </Link>
                                <Link to="" target="_blank" className="link">
                                    <LinkedInIcon />
                                </Link>
                                <Link to="" className="link">
                                    <EmailIcon />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="contact-us-email-form-wrapper">
                        <p>Or email us now.</p>
                        <EmailForm />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;