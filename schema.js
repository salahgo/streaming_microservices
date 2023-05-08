const { gql } = require('@apollo/server');
// Define GraphQL schema
const typeDefs = `#graphql
  type Movie {
    id: String!
    title: String!
    description: String!
  }

  type TVShow {
    id: String!
    title: String!
    description: String!
  }

  type Query {
    movie(id: String!): Movie
    movies: [Movie]
    tvShow(id: String!): TVShow
    tvShows: [TVShow]
  }
`;

module.exports = typeDefs