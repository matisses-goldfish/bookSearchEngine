// TASK: `typeDefs.js`: Define the necessary `Query` and `Mutation` types:

const { gql } = require('apollo-server-express');

// would I need password for the User type?
const typeDefs = gql`
type User {
  _id: ID!
  username: String!
  email: String
  bookCount: Int
  savedBooks: [Book]
}


  type Book {
    authors: [String]
    description: String
    bookId: ID!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  input bookInfo {
    authors: [String]
    description: String
    bookId: ID!
    image: String
    link: String
    title: String!
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: bookInfo!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;