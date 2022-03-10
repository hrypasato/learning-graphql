import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import AuthInput from "./types/input-auth";
import TaskInput from "./types/input-task";
import UserInput from "./types/input-user";
import TaskPayload from "./types/payload-task";
import UserPayload from "./types/payload-user";

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
        }
    }),
});

export default MutationType;