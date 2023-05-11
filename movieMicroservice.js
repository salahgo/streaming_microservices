const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const movieProtoPath = 'movie.proto';
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;

const movieService = {
  getMovie: (call, callback) => {

    const movie = {
      id: call.request.movie_id,
      title: 'Example Movie',
      description: 'This is an example movie.',
  
    };
    callback(null, {movie});
  },
  searchMovies: (call, callback) => {
    const { query } = call.request;

    const movies = [
      {
        id: '1',
        title: 'Example Movie 1',
        description: 'This is the first example movie.',
      },
      {
        id: '2',
        title: 'Example Movie 2',
        description: 'This is the second example movie.',
      },

    ];
    callback(null, { movies });
  },
  createMovie: (call, callback) => {
    const { query } = call.request;
    const movie = {
      id: call.request.movie_id,
      title: call.request.title,
      description: call.request.description,

    };
    callback(null, {movie});
  }

};


const server = new grpc.Server();
server.addService(movieProto.MovieService.service, movieService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`Movie microservice running on port ${port}`);
