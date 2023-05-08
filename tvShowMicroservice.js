// tvShowMicroservice.js

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the tvShow.proto file
const tvShowProtoPath = 'tvShow.proto';
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;

// Implement the TV show service
const tvShowService = {
  getTVShow: (call, callback) => {
    // Retrieve TV show details from the database or any other data source
    const tvShow = {
      id: call.request.tv_show_id,
      title: 'Example TV Show',
      description: 'This is an example TV show.',
      // Add more TV show data fields as needed
    };
    callback(null, {tvShow});
  },
  searchTVShows: (call, callback) => {
    const { query } = call.request;
    // Perform a search for TV shows based on the query
    const tvShows = [
      {
        id: '1',
        title: 'Example TV Show 1',
        description: 'This is the first example TV show.',
      },
      {
        id: '2',
        title: 'Example TV Show 2',
        description: 'This is the second example TV show.',
      },
      // Add more TV show search results as needed
    ];
    callback(null, { tvShows });
  },
  // Add more methods as needed
};

// Create and start the gRPC server
const server = new grpc.Server();
server.addService(tvShowProto.TVShowService.service, tvShowService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`TV show microservice running on port ${port}`);
