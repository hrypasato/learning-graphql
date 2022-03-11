import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from "graphql";
import ApproachInput from "./types/input/input-approach";
import AuthInput from "./types/input/input-auth";
import TaskInput from "./types/input/input-task";
import UserInput from "./types/input/input-user";
import ApproachPayload from "./types/payload/payload-approach";
import TaskPayload from "./types/payload/payload-task";
import UserPayload from "./types/payload/payload-user";

const MutationType = new GraphQLObjectType({
    name:'Mutation',
    fields:() => ({
        userCreate:{
            type: new GraphQLNonNull(UserPayload),
            args: {
                input: { type: new GraphQLNonNull(UserInput) }
            },
            resolve: async (source, { input }, { mutators }) => {
                return mutators.userCreate({ input });
            }
        },
        userLogin: {
            type: new GraphQLNonNull(UserPayload),
            args:{
                input: { type: new GraphQLNonNull(AuthInput) }
            },
            resolve: async ( source, { input }, { mutators } ) =>{
                return mutators.userLogin({ input });
            }
        },
        taskCreate: {
            type: TaskPayload,
            args: {
                input: { type: new GraphQLNonNull(TaskInput) }
            },
            resolve: async (
                source, 
                { input },
                { mutators, currentUser }
            ) => {
                return mutators.taskCreate({ input, currentUser });
            }
        },
        approachCreate:{
            type: ApproachPayload,
            args:{
                taskId: { type: new GraphQLNonNull(GraphQLID)},
                input: { type: new GraphQLNonNull(ApproachInput) }
            },
            resolve: async(
                source,
                { taskId, input },
                { mutators, currentUser }
            ) => {
                return mutators.approachCreate({
                    taskId,
                    input,
                    currentUser,
                    mutators
                });
            }
        }
    }),
});

export default MutationType;