// Updated: Define the query and mutation functionality to work with the Mongoose models.
// code based on activity 26
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Updated: Query Type: 'me': which returns a User type
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
        .select('-__v -password');

      }
      throw new AuthenticationError('Please log in to access this function!');
    },
  },
// Update: Mutation Type- 
  Mutation: {
    //   login: Accepts an email and password as parameters; returns an Auth type.
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('Please try again, no user found with this email address!');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Please try again, Incorrect credentials!');
        }
  
        const token = signToken(user);
        return { token, user };
      },
    // addUser: Accepts a username, email, and password as parameters; returns an Auth type.
    addUser: async (parent, args) => {
      const user = await User.create(args);

      const token = signToken(user);
      return { token, user };
    },
    // saveBook: Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a User type.

    // TODO: (Look into creating what's known as an input type to handle all of these parameters!)
    saveBook: async (parent, { authors, description, title, bookId, image, link }, context) => {
      if (context.user) {
        const updateSavedBooks = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: authors, description, title, bookId, image, link } },
            { new: true }
        );

        return updateSavedBooks;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // removeBook: Accepts a book's bookId as a parameter; returns a User type.
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updateSavedBooks = await User.findByIdAndUpdate(
                { _id: context.user._id },
                // oppsite of save push/ull
                { $pull: { savedBooks: bookId } },
                { new: true }
            );
    
            return updateSavedBooks;
          }
          throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
