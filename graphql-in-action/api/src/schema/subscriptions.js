import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { pubsub } from "../pubsub";
import Approach from "./types/approach/approach";
import Task from "./types/task/task";

const SubscriptionType = new GraphQLObjectType({
    name:'Subscription',
    fields:() => ({
        taskMainListChanged:{
            type: new GraphQLNonNull(Task),
            resolve: async (source) => {
                return source.newTask;
            },
            subscribe: () => {
                return pubsub.asyncIterator(['TASK_MAIN_LIST_CHANGED']);
            }
        },
        voteChanged:{
            type: new GraphQLNonNull(Approach),
            args:{
                taskId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: async (source) => {
                return source.updatedApproach;
            },
            subscribe: async (source, { taskId }) => {
                return pubsub.asyncIterator([`VOTE_CHANGED_${taskId}`]);
            }
        }
    })
});

export default SubscriptionType;