import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { authMiddleware } from './utils/auth.js';
import { getConnection } from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';

// Configuration
const PORT = process.env.PORT || 3001;
const CLIENT_BUILD_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/build');

// Express app setup
const app = express();

// Middlewares to handle incoming requests such as form and JSON data.
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware to serve static files.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(CLIENT_BUILD_PATH));

// Apollo Server setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Routes setup
app.get('/', (req, res) => {
    res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

// Apollo Server middleware
const startApolloServer = async () => {
    await server.start();
    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: authMiddleware,
        }),
    );
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
}

// MongoDB connection and server startup
(async () => {
    try {
        await getConnection();
        await startApolloServer();
    } catch (error) {
        console.error('Error establishing MongoDB connection:', error);
    }
})();