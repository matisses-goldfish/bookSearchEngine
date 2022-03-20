const express = require('express');
const path = require('path');
const db = require('./config/connection');

// Applying Appollo to Express
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');


// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
})

// true or false??
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use('/', (req, res) => {
  res.sendFile(path.join(_dirname, '../client/'))
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 API server now running on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

startApolloServer(typeDefs, resolvers);


