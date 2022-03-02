/** GIA NOTES
 *
 * Use the code below to start a bare-bone express web server
*/
import { graphql } from "graphql";
import { rootValue, schema } from "./schema";

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import * as config from './config';
import { graphqlHTTP } from "express-graphql";

async function main() {
  const server = express();
  server.use(cors());
  server.use(morgan('dev'));
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use('/:fav.ico', (req, res) => res.sendStatus(204));

  // Example route
  server.use('/', graphqlHTTP({
    schema,
    rootValue,
    graphiql:true,
  }));

  // This line rus the server
  server.listen(config.port, () => {
    console.log(`Server URL: http://localhost:${config.port}/`);
  });
}

main();
