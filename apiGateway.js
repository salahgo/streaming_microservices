

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const movieProtoPath = 'movie.proto';
const tvShowProtoPath = 'tvShow.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');


const app = express();
app.use(bodyParser.json());

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

  


const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
      );
  });


app.get('/movies', (req, res) => {
  clientMovies.searchMovies({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.movies);
      }
    });
  });

  app.post('/movie', (req, res) => {
    const {id, title, description} = req.body;    
    clientMovies.createMovie({movie_id: id, title: title, description: description}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.movie);
      }
    });
  })
  
  app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    clientMovies.getMovie({ movieId: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.movie);
      }
    });
  });


  
  app.get('/tvshows', (req, res) => {
    clientTVShows.searchTvshows({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.tv_shows);
      }
    });
  });
  
  app.get('/tvshows/:id', (req, res) => {
    const id = req.params.id;
    clientTVShows.getTvshow({ tvShowId: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.tv_show);
      }
    });
  });


const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
