/* eslint-disable import/no-anonymous-default-export */
// Use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';

// Create a new class to instantiate for a user.
class AuthService {
    // Get user data from JSON web token by decoding it
    getUser () {
        return decode(this.getToken());
    }

    // Return `true` or `false` if token exists (does not verify if it's expired yet).
    loggedIn () {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired (token) {
        try {
            const decodedJWT = decode(token);
            // Date.now() returns the current timestamp in milliseconds, so divide it by 1,000 to get a timestamp in seconds.
            const currentTime = Date.now() / 1000;
            // `exp` claim identifies the expiration time.
            if (decodedJWT.exp < currentTime) {
                return true;
            } else return false;
        } catch (err) {
            return false;
        }
    }

    // Retrieve the user token from localStorage.
    getToken () {
        return localStorage.getItem('id_token');
    }

    login (idToken) {
        // Save user token to localStorage and reloads the application for logged-in status to take effect.
        localStorage.setItem('id_token', idToken);
        window.location.assign('/');
    }

    logout () {
        // Clear user token and profile data from localStorage.
        localStorage.removeItem('id_token');
        // Reload the page and reset the state of the application.
        window.location.assign('/');
    }
}

export default new AuthService();