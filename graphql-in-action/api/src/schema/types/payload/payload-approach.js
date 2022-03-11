import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import Approach from "../approach/approach";
import UserError from "../user/user-error";

const ApproachPayload = new GraphQLObjectType({
    name:'ApproachPayload',
    fields: () => ({
        errors:{
            type:new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(UserError))
            )
        },
        approach: { type: Approach }
    })
});

export default ApproachPayload;