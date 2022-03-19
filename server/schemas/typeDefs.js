const { gql } = require('apollo-server-express');

const typeDefs = gql`

type Query {
    me: User
}

type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: String!
    savedBooks: [Book]
}

 type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String!
    link: String!
 }

 type Auth {
     token: ID!
     user: User
 }

 type mutations {
    login(email: string!, password: String!): Auth
    addUser(username: String!, email: String!, password:String!);
    saveBook(authors: String, description: String!, title: String!, bookId: String!, image: String!, link: String!): User
    removeBook(bookId: ID!): User
 }
`;

module.exports = typeDefs;
