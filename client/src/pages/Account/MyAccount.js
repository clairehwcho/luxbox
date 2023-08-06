import React, { useEffect } from "react";

import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { QUERY_USER } from "../../utils/queries";
import Auth from "../../utils/auth";

import AccountDetail from "../../components/Account/AccountDetail";
import OrderHistory from "../../components/Account/OrderHistory";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

const MyAccount = () => {
    const { accountParam } = useParams();

    const { data } = useQuery(QUERY_USER);

    const user = data?.user || {};
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!Auth.loggedIn()) {
            return navigate("/account/sign-in");
        }
    }, [navigate]);

    useEffect(() => {
        if (!data) {
            return navigate("/");
        }
    }, [data, navigate]);

    return (
        <section className="main-content-container">
            <div className="main-content-row">
                <h3>
                    Welcome to your account, {user.firstName}!
                </h3>
            </div>
            <div className="main-content-row">
                <div className="account-wrapper">
                    <div className="main-account-menu-wrapper">
                        <Accordion
                            sx={{
                                width: "100%",
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={{
                                    width: "100%",
                                }}
                            >
                                <p>MY ACCOUNT</p>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul>
                                    <li>
                                        <Link to="/account/details" className="link">
                                            Account Details
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/account/orders" className="link">
                                            Order History
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/account/wishlist" className="link">
                                            Wish List
                                        </Link>
                                    </li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className="account-content-wrapper">
                        {accountParam === "details" && <AccountDetail user={user} />}
                        {accountParam === "orders" && <OrderHistory user={user} />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyAccount;