import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

const secret = process.env.JWT_SECRET;
const expiration = "2h";

export const authMiddleware = ({ req }) => {
    // Allow token to be sent via req.body, req.query, or headers.
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Split the token string into an array ["Bearer", "<tokenvalue>"] and return actual token.
    if (req.headers.authorization) {
        token = token.split(" ").pop().trim();
    }

    if (!token) {
        return req;
    }

    // If token can be verified, add the decoded user's data to the request so it can be accessed in the resolver.
    try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        req.user = data;
    } catch {
        console.log('Invalid token');
    }

    // Return the request object so it can be passed to the resolver as `context`.
    return req;
};

export const signToken = ({ firstName, lastName, email, _id }) => {
    const payload = { firstName, lastName, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};