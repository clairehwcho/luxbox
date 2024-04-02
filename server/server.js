import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { authMiddleware } from './utils/auth.js';
import db from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';

const PORT = process.env.PORT || 3001;

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
    startApolloServer()
});

const startApolloServer = async () => {
    await server.start();
    app.use(
        '/graphql',
        cors(),
        express.urlencoded({ extended: false }),
        express.json(),
        expressMiddleware(server, {
            context: authMiddleware,
        }),
    );
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}