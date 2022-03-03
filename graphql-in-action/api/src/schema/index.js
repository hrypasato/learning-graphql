import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { numbersInRangeObject } from "../utils";
import NumbersInRange from "./types/numbers-in-range";

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields:{
        currentTime: {
            type: GraphQLString,
            resolve: () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const isoString = new Date().toISOString();
                        resolve(isoString.slice(11,19));
                    }, 5000);
                });
            }
        },
        sumNumbersInRange:{
            type: new GraphQLNonNull(GraphQLInt),
            args:{
                begin: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                end:{
                    type: new  GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: function( source, { begin, end }){
                let sum = 0;
                for(let i = begin; i <= end; i++){
                    sum += i
                }
                return sum;
            }
        },
        numbersInRange:{
            type: NumbersInRange,
            args:{
                begin: { type: new  GraphQLNonNull(GraphQLInt) },
                end: { type: new  GraphQLNonNull(GraphQLInt) }
            },
            resolve: function(source, { begin, end }){
                return numbersInRangeObject(begin, end);
            }
        }
    }
});

export const schema = new GraphQLSchema({
    query: QueryType
})