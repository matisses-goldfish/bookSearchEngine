import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String!
        link: String!
      }
    }
  }
`;