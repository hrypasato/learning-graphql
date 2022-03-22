import { GraphQLSchema, printSchema } from "graphql";
import MutationType from "./mutations";
import QueryType from "./queries";
import SubscriptionType from "./subscriptions";

export const schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
    subscription: SubscriptionType
})

console.log(printSchema(schema));