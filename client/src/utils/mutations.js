// TODO: toker Change for saveBook and removeBook user {}
import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation addUser($author: String, $description: String, $title: String!, $bookId: String!, $image: String, $link: String) {
    addUser(author: $author, description: $description, title: $title, bookId: $bookId, image: $image, link: $link) {
      token
      user {
        _id
        auther
        description
        title
        bookId
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      token
      user {
        bookId
      }
    }
  }
`;