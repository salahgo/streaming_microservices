// movieMicroservice.js

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the movie.proto file
const movieProtoPath = 'movie.proto';
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;

// Implement the movie service
const movieService = {
  getMovie: (call, callback) => {
      // Retrieve movie details from the database or any other data source
    const movie = {
      id: call.request.movie_id,
      title: 'Example Movie',
      description: 'This is an example movie.',
      // Add more movie data fields as needed
    };
    callback(null, {movie});
  },
  searchMovies: (call, callback) => {
    const { query } = call.request;
    // Perform a search for movies based on the query
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
      // Add more movie search results as needed
    ];
    callback(null, { movies });
  },
  // Add more methods as needed
};

// Create and start the gRPC server
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
