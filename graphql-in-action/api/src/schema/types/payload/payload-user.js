import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import User from "../user/user";
import UserError from "../user/user-error";

const UserPayload = new GraphQLObjectType({
    name:'UserPayload',
    fields:()=>({
        errors:{
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(UserError))
            )
        },
        user:{ type: User },
        authToken: { type: GraphQLString }
    })
});

export default UserPayload;