import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './services/auth.js';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3001;
// Create Apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Enable CORS with custom options (if needed)
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow frontend origin
    credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions));
// Apply Apollo Server middleware with context for authentication
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
        // Call auth middleware and return the modified request as context
        const contextValue = authMiddleware({ req });
        return { user: contextValue.user };
    },
}));
// Health check endpoint
app.get('/health', (_, res) => {
    res.status(200).send('OK');
});
// If we're in production, serve client/dist as static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
}
// Default route for unknown endpoints
app.use((_, res) => {
    res.status(404).send('Not Found');
});
// Update database connection to use environment variables
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booksearch';
import mongoose from 'mongoose';
mongoose.connect(DB_URI)
    .then(() => {
    console.log('✅ Successfully connected to the database');
    app.listen(PORT, () => {
        console.log(`🌍 API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
})
    .catch((err) => {
    console.error('❌ Database connection error:', err);
});
