import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import Task from "../task/task";
import UserError from "../user/user-error";

const TaskPayload = new GraphQLObjectType({
    name: 'TaskPayload',
    fields: () => ({
        errors: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(UserError))
            )
        },
        task: { type: Task }
    })
});

export default TaskPayload;