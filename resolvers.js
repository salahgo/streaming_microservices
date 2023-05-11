

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


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
const clientMovies = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
const clientTVShows = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());


const resolvers = {
  Query: {
    movie: (_, { id }) => {

      return new Promise((resolve, reject) => {
        clientMovies.getMovie({ movieId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.movie);
          }
        });
      });
    },
    movies: () => {


      return new Promise((resolve, reject) => {
        clientMovies.searchMovies({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.movies);
          }
        });
      });
    },
    tvShow: (_, { id }) => {
   
      return new Promise((resolve, reject) => {
        clientTVShows.getTvshow({ tvShowId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.tv_show);
          }
        });
      });
    },
    tvShows: () => {
    
      return new Promise((resolve, reject) => {
        clientTVShows.searchTvshows({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.tv_shows);
          }
        });
      });
    },
   
  },
  Mutation: {
    createMovie: (_, {id, title, description} ) => {
      return new Promise((resolve, reject) => {
        clientMovies.createMovie({movie_id: id, title: title, description: description}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.movie);
          }
        });
      });
    },
  }
};

module.exports = resolvers;
