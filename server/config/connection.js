import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

const dbName = process.env.DB_NAME;

mongoose.connect(process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log(`Successfully connected to ${dbName}`);
    })
    .catch((error) =>
        console.log(`mongoose connection to ${dbName} failed: `, error)
    );

export default mongoose.connection;
