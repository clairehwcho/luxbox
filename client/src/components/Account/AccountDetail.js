import { useState, Fragment } from "react";

import { useMutation } from '@apollo/client';
import { QUERY_USER } from "../../utils/queries";
import { UPDATE_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";

import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

const AccountDetail = (props) => {
    const [personalInfoEditedState, setPersonalInfoEditedState] = useState(false);
    const [passwordEditedState, setPasswordEditedState] = useState(false);

    const [formState, setFormState] = useState({
        _id: props.user._id,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        email: props.user.email,
        password: props.user.password,
    });

    const [updateUser, { loading, error }] = useMutation(UPDATE_USER, {
        refetchQueries: [QUERY_USER, "GetUser"]
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            await updateUser({
                variables: { ...formState }
            });

            setPersonalInfoEditedState(false);
            setPasswordEditedState(false);

        } catch (err) {
            console.error(err);
        }
    };

    const handleEditButton = (event) => {
        event.preventDefault();

        if (event.target.id === "personal-info-edit-button") {
            setPersonalInfoEditedState(true);
        }
        else if (event.target.id === "password-edit-button") {
            setPasswordEditedState(true);
        }
    }

    const handleCancelButton = (event) => {
        event.preventDefault();

        if (event.target.id === "personal-info-cancel-button") {
            setPersonalInfoEditedState(false);
        }
        else if (event.target.id === "password-cancel-button") {
            setPasswordEditedState(false);
        }
    }

    return (
        <div className="account-detail-wrapper">
            <div className="outlined-box account-detail-box">
                <div className="outlined-box-header">
                    <h3>Personal information</h3>
                </div>
                {personalInfoEditedState
                    ? (<Fragment>
                        <div className="outlined-box-body" id="personal-info-body">
                            <form className="account-form" onSubmit={handleFormSubmit}>
                                <FormGroup className="form-group">
                                    <InputLabel htmlFor="edit-first-name" sx={{ fontSize: "small" }}>First Name</InputLabel>
                                    <Input
                                        className="form-input"
                                        id="edit-first-name"
                                        name="firstName"
                                        defaultValue={formState.firstName}
                                        sx={{
                                            fontSize: "small"
                                        }}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup className="form-group">
                                    <InputLabel htmlFor="edit-last-name" sx={{ fontSize: "small" }}>Last Name</InputLabel>
                                    <Input
                                        className="form-input"
                                        id="edit-last-name"
                                        name="lastName"
                                        defaultValue={formState.lastName}
                                        sx={{
                                            fontSize: "small"
                                        }}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup className="form-group">
                                    <InputLabel htmlFor="edit-email" sx={{ fontSize: "small" }}>Email</InputLabel>
                                    <Input
                                        className="form-input"
                                        id="edit-email"
                                        name="email"
                                        type="email"
                                        defaultValue={formState.email}
                                        sx={{
                                            fontSize: "small"
                                        }}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <div className="account-detail-button-wrapper">
                                    <button className="filled-btn" type="submit">
                                        {loading ? "Updating..." : "Update"}
                                    </button>
                                    <button className="outlined-btn" id="personal-info-cancel-button" onClick={handleCancelButton} type="button" >
                                        Cancel
                                    </button>
                                </div>
                                {error && (
                                    <p className="form-error-message">Something went wrong. Try again.</p>
                                )}
                            </form>
                        </div>
                    </Fragment>)
                    : (<Fragment>
                        <div className="outlined-box-body" id="personal-info-body">
                            <p>{props.user.firstName} {props.user.lastName}</p>
                            <p>{props.user.email}</p>
                        </div>
                        <div className="outlined-box-footer">
                            <p id="personal-info-edit-button" onClick={handleEditButton}>Edit</p>
                        </div>
                    </Fragment>)
                }
            </div>
            <div className="outlined-box account-detail-box">
                <div className="outlined-box-header">
                    <h3>Password Settings</h3>
                </div>
                {passwordEditedState
                    ? (<Fragment>
                        <div className="outlined-box-body" id="password-body">
                            <form className="account-form" onSubmit={handleFormSubmit}>
                                <FormGroup className="form-group">
                                    <InputLabel htmlFor="edit-pw" sx={{ fontSize: "small" }}>New Password</InputLabel>
                                    <Input
                                        className="form-input"
                                        id="edit-pw"
                                        placeholder="Enter at least 4 characters."
                                        name="password"
                                        type="password"
                                        sx={{
                                            fontSize: "small"
                                        }}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <div className="account-detail-button-wrapper">
                                    <button className="filled-btn" type="submit">
                                        {loading ? "Updating..." : "Update"}
                                    </button>
                                    <button className="outlined-btn" id="password-cancel-button" onClick={handleCancelButton} type="button" >
                                        Cancel
                                    </button>
                                </div>
                                {error && (
                                    <p className="form-error-message">Something went wrong. Try again.</p>
                                )}
                            </form>
                        </div>
                    </Fragment>)
                    : (<Fragment>
                        <div className="outlined-box-body" id="password-body">
                            <p>Change your password.</p>
                        </div>
                        <div className="outlined-box-footer">
                            <p id="password-edit-button" onClick={handleEditButton}>Edit</p>
                        </div>
                    </Fragment>)
                }
            </div>
        </div>
    );
};

export default AccountDetail;