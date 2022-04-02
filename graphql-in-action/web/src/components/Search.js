import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';

import { useStore } from '../store';

const SEARCH_RESULTS = gql`
query searchResults($searchTerm: String!){
  searchResults: search(term: $searchTerm){
    type:__typename
    id
    content
    ...on Task{
      approachCount
      author{
        username
      }
    }
    ...on Approach{
      task{
        id
        content
      }
      author{
        username
      }
    }
  }
}
`;

function SearchResults ({ searchTerm, onlyMine, user }){
  const { AppLink } = useStore();
  const { error, loading, data } = useQuery(SEARCH_RESULTS, {
    variables: { searchTerm }
  });

  if(error){
    return <div className='error'>{error.message}</div>;
  }

  if(loading){
    return <div className='loading'>Loading...</div>
  }

  const results = onlyMine ? [...data.searchResults]
                              .filter(result => result.author.username === user.username)
                            : [...data.searchResults];

  return (
    <div>
      {data && data.searchResults && (
        <div>
          <h2>Search Results</h2>
          <div className="y-spaced">
            {results.length === 0 && (
              <div className="box box-primary">No results</div>
            )}
            {results.map((item, index) => (
              <div key={index} className="box box-primary">
                <AppLink
                  to="TaskPage"
                  taskId={
                    item.type === 'Approach' ? item.task.id : item.id
                  }
                >
                  <span className="search-label">{item.type}</span>{' '}
                  {item.content.substr(0, 250)}
                </AppLink>
                <div className="search-sub-line">
                  {item.type === 'Task'
                    ? `Approaches: ${item.approachCount}`
                    : `Task: ${item.task.content.substr(0, 250)}`}
                </div>
              </div>
            ))}
          </div>
          <AppLink to="Home">{'<'} Home</AppLink>
        </div>
      )}
    </div>
  )

}

export default function Search({ searchTerm = null }) {
  const { setLocalAppState, useLocalAppState } = useStore();
  const [onlyMine, setOnlyMine] = useState(false);
  const user = useLocalAppState('user');

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const term = event.target.search.value;

    setLocalAppState({
      component: { name: 'Search', props: { searchTerm: term } },
    });
  };

  return (
    <div>
      <div className="main-container">
        <form method="post" onSubmit={handleSearchSubmit}>
          <div className="center">
            <input
              type="search"
              name="search"
              className="input-append"
              defaultValue={searchTerm}
              placeholder="Search all tasks and approaches"
              required
            />
            <div className="">
              <button className="btn btn-append" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>
        <div>
          <label className='checkbox'>
            <input type="checkbox" disabled={!user} checked={onlyMine} onChange={() => setOnlyMine(!onlyMine)} name="controlled"/>
            Only my work
          </label>
        </div>
      </div>
      { searchTerm && <SearchResults searchTerm={searchTerm} onlyMine={onlyMine} user={user}/>}
    </div>
  );
}
