import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import NumbersInRange from './types/numbers-in-range';
import { numbersInRangeObject } from '../utils';
import Task from "./types/task";

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
        },
        taskMainList:{
            type: new GraphQLList(new GraphQLNonNull(Task)),
            resolve: async (source, args, { loaders }) => {
                return loaders.tasksByTypes.load('latest');
            }
        },
        taskInfo:{
            type: Task,
            args: {
                id:{ type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (source, args, { loaders }) => {
                return loaders.tasks.load(args.id);
            }
        }
    }
});

export default QueryType;