// resolvers.js

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the movie and TV show proto files
const movieProtoPath = 'movie.proto';
const tvShowProtoPath = 'tvShow.proto';
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;

// Define resolvers for GraphQL queries
const resolvers = {
  Query: {
    movie: (_, { id }) => {
      // Make gRPC call to the movie microservice
      const client = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getMovie({ movieId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.movie);
          }
        });
      });
    },
    movies: () => {
      // Make gRPC call to the movie microservice
      const client = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchMovies({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.movies);
          }
        });
      });
    },
    tvShow: (_, { id }) => {
      // Make gRPC call to the TV show microservice
      const client = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getTVShow({ tvShowId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.tv_show);
          }
        });
      });
    },
    tvShows: () => {
      // Make gRPC call to the TV show microservice
      const client = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchTVShows({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.tv_shows);
          }
        });
      });
    },
  },
};

module.exports = resolvers;
