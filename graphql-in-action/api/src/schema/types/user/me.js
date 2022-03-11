import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import Task from "./task";
import { userFields } from "./user";

const Me = new GraphQLObjectType({
    name: 'Me',
    fields: {
        ...userFields,
        taskList: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(Task))
            ),
            resolve: (source, args, { loaders, currentUser }) => {
                return loaders.taskForUsers.load(currentUser.id);
            }
        }
    }
});

export default Me;