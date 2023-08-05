import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';

import Auth from '../../utils/auth';

import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

const Register = () => {
    const [formState, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [addUser, { loading, error }] = useMutation(ADD_USER);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const mutationResponse = await addUser({
                variables: { ...formState },
            });

            const token = mutationResponse.data.addUser.token;
            Auth.login(token);
        } catch (err) {
            console.error(err);
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (Auth.loggedIn()) {
            return navigate('/account/details');
        }
    }, [navigate]);

    return (
        <section className="main-content-container">
            <div className="main-content-row">
                <h3>Register</h3>
            </div>
            <div className="main-content-row">
                <div className="account-form-wrapper">
                    <form className="account-form" onSubmit={handleFormSubmit}>
                        <FormGroup className="form-group">
                            <InputLabel htmlFor="register-first-name" sx={{ fontSize: "small" }}>First Name</InputLabel>
                            <Input
                                className="form-input"
                                id="register-first-name"
                                placeholder="Enter your first name."
                                name="firstName"
                                type="text"
                                value={formState.firstName}
                                sx={{
                                    fontSize: "small"
                                }}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup className="form-group">
                            <InputLabel htmlFor="register-last-name" sx={{ fontSize: "small" }}>Last Name</InputLabel>
                            <Input
                                className="form-input"
                                id="register-last-name"
                                placeholder="Enter your last name."
                                name="lastName"
                                type="text"
                                value={formState.lastName}
                                sx={{
                                    fontSize: "small"
                                }}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup className="form-group">
                            <InputLabel htmlFor="register-email" sx={{ fontSize: "small" }}>Email</InputLabel>
                            <Input
                                className="form-input"
                                id="register-email"
                                placeholder="Enter your email."
                                name="email"
                                type="email"
                                value={formState.email}
                                sx={{
                                    fontSize: "small"
                                }}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup className="form-group">
                            <InputLabel htmlFor="register-pw" sx={{ fontSize: "small" }}>Password</InputLabel>
                            <Input
                                className="form-input"
                                id="register-pw"
                                placeholder="Enter at least 4 characters."
                                name="password"
                                type="password"
                                value={formState.password}
                                sx={{
                                    fontSize: "small"
                                }}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <button className="filled-btn" type="submit">
                            {loading ? "Creating..." : "Create Account"}
                        </button>
                        {error && (
                            <p className="form-error-message">{error.message}</p>
                        )}
                    </form>
                    <div className="switch-account-form-wrapper">
                        <p>Already have an account?</p>
                        <Link to="/account/sign-in" className="link">
                            <button className="outlined-btn" id="create-account-btn">Sign In</button>
                        </Link>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Register;