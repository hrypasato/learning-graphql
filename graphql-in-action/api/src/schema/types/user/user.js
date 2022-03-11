import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const userFields = {
    id:{ type: new GraphQLNonNull(GraphQLID) },
    username: { type: GraphQLString },
    name:{
        type: new GraphQLNonNull(GraphQLString),
        resolve: ({ firstName, lastName }) => [firstName, lastName].filter(Boolean).join(' '),
    }
}

const User = new GraphQLObjectType({
    name:'User',
    fields: userFields
});

export default User;