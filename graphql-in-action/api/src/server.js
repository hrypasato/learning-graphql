import { schema } from "./schema";

import * as config from './config';
import pgApiWrapper from "./db/pg-api";
import DataLoader from "dataloader";
import mongoApiWrapper from "./db/mongo-api";
import { ApolloServer } from "apollo-server";

async function main() {
  const pgApi = await pgApiWrapper();
  const mongoApi = await mongoApiWrapper();

  const server = new ApolloServer({
    schema,
    formatError: (err) => {
      const errorReport = {
        message: err.message,
        locations: err.locations,
        stack: err.stack ? err.stack.split('\n') : [],
        path: err.path
      };
      console.error('GraphQL Error', errorReport);
      return config.isDev ? errorReport : { message: 'Oops! Something went wrong! :('};
    },
    context: async({ req }) => {
      const authToken = req && req.headers.authorization 
      ? req.headers.authorization.slice(7) //"Bearer "
      : null;

      const currentUser = await pgApi.userFromAuthToken(authToken);
      if(authToken && !currentUser){
        throw Error('Invalid access token');
      }

      const loaders = {
        users: new DataLoader((userIds) => pgApi.usersInfo(userIds)),
        approachLists: new DataLoader((taskIds) => pgApi.approachLists(taskIds)),
        tasks: new DataLoader((taskIds) => pgApi.taskInfo({ taskIds, currentUser })),
        tasksByTypes: new DataLoader((types) => pgApi.tasksByTypes(types)),
        searchResults: new DataLoader((searchTerms) => pgApi.searchResults({ searchTerms, currentUser })),
        detailLists: new DataLoader((approachIds) => mongoApi.detailLists(approachIds)),
        taskForUsers: new DataLoader((userIds) => pgApi.taskForUsers(userIds))
      };

      const mutators = {
        ...pgApi.mutators,
        ...mongoApi.mutators
      };

      return { loaders, mutators, currentUser };
    }
  });

  server.listen({ port: config.port })
        .then(({ url, subscriptionsUrl }) => {
          console.log(`Server URL: ${url}`);
          console.log(`Subscriptions URL: ${subscriptionsUrl}`);
        });
}

main();
