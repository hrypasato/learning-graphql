import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

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
        }
    }
});

export default Task;