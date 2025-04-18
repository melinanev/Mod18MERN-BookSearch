import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authMiddleware } from './services/auth.js';

// Convert top-level file to a module with top-level await
export {};  // Important: makes the file a module

const app = express();
const PORT = process.env.PORT || 3001;

// Create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo server
await server.start();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apply Apollo Server middleware with context for authentication
app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => {
    // Call auth middleware and return the modified request as context
    const contextValue = authMiddleware({ req });
    return { user: contextValue.user };
  },
}));

// If we're in production, serve client/dist as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});
