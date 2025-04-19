import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './services/auth.js';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Convert top-level file to a module with top-level await
export {};  // Important: makes the file a module

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Ensure PORT is obtained from environment variables

// Create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start(); // Ensure the server is started before applying middleware

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

mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ Successfully connected to the database');
    app.listen(PORT, () => { // Bind to the correct port
      console.log(`🌍 API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1); // Exit the process if the database connection fails
  });

