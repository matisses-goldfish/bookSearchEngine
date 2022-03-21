// TASK: Define the query and mutation functionality to work with the Mongoose models.
// **reference activity 26**
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Updated: Query Type: 'me': which returns a User type
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
        .select('-__v -password');

        return userData;
      }

      throw new AuthenticationError('Please login to view saved books');
    },
  },
// Update: Mutation Type- 
  Mutation: {
    //login: Accepts an email and password as parameters; returns an Auth type.
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Please try again or create an account!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password, please try again!');
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
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const userSaveBooks = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return userSaveBooks;
      }

      throw new AuthenticationError('Please login to use this function!');
    },
    // removeBook: Accepts a book's bookId as a parameter; returns a User type.
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const userRemoveBooks = await User.findByIdAndUpdate(
                { _id: context.user._id },
                // oppsite of save push/pull
                { $pull: { savedBooks: bookId } },
                { new: true }
            );
    
            return userRemoveBooks;
          }
          throw new AuthenticationError('please login to use this function!');
    },
  },
};

module.exports = resolvers;
