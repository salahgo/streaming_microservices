// apiGateway.js

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the movie and TV show proto files
const movieProtoPath = 'movie.proto';
const tvShowProtoPath = 'tvShow.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Create a new Express application
const app = express();

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
  

// Create an ApolloServer instance with the imported schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the ApolloServer middleware to the Express application
server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
      );
  });


app.get('/movies', (req, res) => {
    const client = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
    client.searchMovies({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.movies);
      }
    });
  });
  
  app.get('/movies/:id', (req, res) => {
    const client = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getMovie({ movieId: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.movie);
      }
    });
  });
  
  app.get('/tvshows', (req, res) => {
    const client = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
    client.searchTvshows({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.tv_shows);
      }
    });
  });
  
  app.get('/tvshows/:id', (req, res) => {
    const client = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getTvshow({ tvShowId: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.tv_show);
      }
    });
  });

// Start the Express application
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
