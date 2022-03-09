import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import AuthInput from "./types/input-auth";
import UserInput from "./types/input-user";
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
        }
    }),
});

export default MutationType;