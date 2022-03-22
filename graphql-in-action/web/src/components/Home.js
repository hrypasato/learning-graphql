import { gql, useQuery, useSubscription } from '@apollo/client';
import React from 'react';

import Search from './Search';
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from './TaskSummary';
import { useStore } from '../store';

const TASK_MAIN_LIST = gql`
query taskMainList {
  taskMainList{
    id
    ...TaskSummary
  }
}
${TASK_SUMMARY_FRAGMENT}
`;

const TASK_MAIN_LIST_CHANGED = gql`
subscription taskMainListChangedSubscription{
  newTask:taskMainListChanged{
    id
    ...TaskSummary
  }
}
${TASK_SUMMARY_FRAGMENT}
`;

export default function Home() {
  const { setLocalAppState } = useStore();

  const { error, loading, data } = useQuery(TASK_MAIN_LIST);
  const results = useSubscription(TASK_MAIN_LIST_CHANGED);

  if(error || results.error){
    return <div className='error'>{error.message}</div>
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Search />
      <div>
        <h1>Latest</h1>
        { results.data && 
          <TaskSummary 
            key={results.data.newTask.id}
            task={results.data.newTask}
            link={true}
            first={true}
          /> 
        }
        {data.taskMainList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
