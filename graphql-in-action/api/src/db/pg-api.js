import pgClient from "./pg-client";
import sqls from './sqls';

const pgApiWrapper = async () => {
    const { pgPool } = await pgClient();
    const pgQuery = (text, params = {}) => 
        pgPool.query(text, Object.values(params));

    return {
        taskMainList: async () => {
            const pgResp = await (pgQuery(sqls.tasksLatest));
            return pgResp.rows;
        },
        usersInfo: async (userIds) => {
            const pgResp = await pgQuery(sqls.usersFromIds, { $1:[userIds] });
            
            //posible mejora a map y find
            
            const resp = pgResp.rows.reduce((obj, row) => {
                obj[row.id] = row;
                return obj;
            },{});

            return userIds.map((userId) => resp[userId]);
            

            //return userIds.map((userId) => pgResp.rows.find((row) => userId === row.id));
        },
        approachLists: async (taskIds) => {
            const pgResp = await pgQuery(sqls.approachesForTaskIds, { $1:taskIds });
            return taskIds.map((taskId) => pgResp.rows.filter((row) => taskId === row.taskId));
        },
        taskInfo: async (taskIds) => {
            const pgResp = await pgQuery(sqls.tasksFromIds, { $1: taskIds, $2: null })
            return taskIds.map((taskId) => pgResp.rows.find((row) => taskId == row.id));
        }
    }
}

export default pgApiWrapper;