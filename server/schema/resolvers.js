// TODO: Check resolvers routes (.populate('users');???)
const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('users');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('users');
    },
    savedBooks: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Book.find(params).sort({ createdAt: -1 });
    },
    Book: async (parent, { bookId }) => {
      return Book.findOne({ bookId }).populate ('bookSchema');
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('users');
      }
      throw new AuthenticationError('Please login to complete this action!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, {author, description, title, bookId, image, link}, context) => {
      if (context.user) {
        const updatedUser = await Book.create({
          author,
          description,
          title,
          bookId,
          image,
          link
        });

        await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: body } },
            { new: true, runValidators: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError('Please login to complete this request!');
    },

    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await Book.findOneAndDelete({
          bookId
        });

        await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { savedBooks: { bookId: params.bookId } } },
            { new: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError('Please login to complete this request!');
    },
  },
};

module.exports = resolvers;
