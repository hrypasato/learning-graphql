import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import Approach from "./approach";
import User from "./user";

const Task = new GraphQLObjectType({
    name: 'Task',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        approachCount: { type: new GraphQLNonNull(GraphQLInt) },
        createdAt: { 
            type: new GraphQLNonNull(GraphQLString),
            resolve: (source) => source.createdAt.toISOString() 
        },
        tags: {
            type:new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(GraphQLString))
            ),
            resolve: (source) => source.tags.split(',')
        },
        author: {
            type: new GraphQLNonNull(User),
            resolve: (source, args, { loaders }) => loaders.users.load(source.userId)
        },
        approachList:{
            type:new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(Approach))
            ),
            resolve: (source, args, { loaders }) => loaders.approachLists.load(source.id)
        }
    }
});

export default Task;