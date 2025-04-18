// Define the GraphQL schema types, queries, and mutations

const typeDefs = `#graphql
  # Define the Book type
  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  # Define the User type
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  # Define the Auth type for login/signup responses
  type Auth {
    token: String!
    user: User
  }

  # Define input type for saving books
  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  # Define the Query type
  type Query {
    me: User
  }

  # Define the Mutation type
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;
