import React, { useState } from 'react';

import { useStore } from '../store';
import NewApproach from './NewApproach';
import Approach, { APPROACH_FRAGMENT } from './Approach';
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from './TaskSummary';
import { gql, useQuery, useSubscription } from '@apollo/client';

const VOTE_CHANGED = gql`
subscription voteChanged($taskId: ID!){
  voteChanged(taskId:$taskId){
    id
    voteCount
  }
}
`;

export const FULL_TASK_FRAGMENT = gql`
fragment FullTaskData on Task {
  id
  ...TaskSummary
  approachList{
    id
    ...ApproachFragment
  }
}
${TASK_SUMMARY_FRAGMENT}
${APPROACH_FRAGMENT}
`;

const TASK_INFO = gql`
query taskInfo($taskId: ID!){
  taskInfo(id:$taskId){
    ...FullTaskData
  }
}
${FULL_TASK_FRAGMENT}
`;

export default function TaskPage({ taskId }) {
  const { AppLink } = useStore();
  const [showAddApproach, setShowAddApproach] = useState(false);
  const [highlightedApproachId, setHighlightedApproachId] = useState();
  const [ sortByDate, setSortByDate ] = useState(false);

  const { error, loading, data } = useQuery(TASK_INFO, {
    variables:{
      taskId
    }
  });

  useSubscription(VOTE_CHANGED, {
    variables:{ taskId }
  });

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const { taskInfo } = data;

  const handleAddNewApproach = (addNewApproach) => {
    const newApproachId = addNewApproach(taskInfo);
    setHighlightedApproachId(newApproachId);
    setShowAddApproach(false);
  };

  return (
    <div>
      <AppLink to="Home">{'<'} Home</AppLink>
      <TaskSummary task={taskInfo} />
      <div>
        <div>
          {showAddApproach ? (
            <NewApproach
              taskId={taskId}
              onSuccess={handleAddNewApproach}
            />
          ) : (
            <div className="center y-spaced">
              <button
                onClick={() => setShowAddApproach(true)}
                className="btn btn-secondary"
              >
                + Add New Approach
              </button>
            </div>
          )}
        </div>
        <h2>Approaches ({taskInfo.approachList.length})</h2>
        <div>Sort by:
          <button
            className="btn btn-secondary btn-secondary--small"
            onClick={() => setSortByDate(!sortByDate)}
          >
            { sortByDate ? 'Votes' : 'Date'}
          </button>
        </div>
        {( !sortByDate ? 
            taskInfo.approachList : 
            [...taskInfo.approachList].sort((a,b) => a.createdAt > b.createdAt ? 1 : -1 )
            ).map((approach) => (
          <div key={approach.id} id={approach.id}>
            <Approach
              approach={approach}
              isHighlighted={highlightedApproachId === approach.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
