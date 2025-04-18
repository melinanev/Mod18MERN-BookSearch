import { GraphQLError } from 'graphql';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

// Define context types
interface Context {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

const resolvers = {
  Query: {
    // Get the logged-in user
    me: async (_: any, __: any, context: Context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
      throw new GraphQLError('Not logged in', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    },
  },

  Mutation: {
    // Login user
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new GraphQLError('Incorrect credentials', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new GraphQLError('Incorrect credentials', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Add a new user
    addUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Save a book to user's savedBooks
    saveBook: async (_: any, { input }: { input: any }, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new GraphQLError('You need to be logged in to save books', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    },

    // Remove a book from user's savedBooks
    removeBook: async (_: any, { bookId }: { bookId: string }, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new GraphQLError('You need to be logged in to remove books', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    },
  },
};

export default resolvers;
