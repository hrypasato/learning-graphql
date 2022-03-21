import React, { useState } from 'react';
import fetch from 'cross-fetch';

import * as config from './config';
import { ApolloClient, gql, HttpLink, InMemoryCache, useApolloClient, useQuery } from '@apollo/client';
import { setContext } from '@apollo/link-context';

const cache = new InMemoryCache();
const httpLink = new HttpLink({ uri: config.GRAPHQL_SERVER_URL });
const client = new ApolloClient({ cache, link:httpLink });

const initialLocalAppState = {
  component: { name: 'Home', props: {} },
  user: JSON.parse(window.localStorage.getItem('azdev:user')),
};

export const LOCAL_APP_STATE = gql`
  query localAppState {
    component @client {
      name
      props
    }
    user @client{
      username
      authToken
    }
  }
`;

// The useStoreObject is a custom hook function designed
// to be used with React's context feature
export const useStore = () => {
  // This state object is used to manage
  // all local app state elements (like user/component)
  const client = useApolloClient();
  // This function can be used with 1 or more
  // state elements. For example:
  // const user = useLocalAppState('user');
  // const [component, user] = useLocalAppState('component', 'user');
  const useLocalAppState = (...stateMapper) => {
    const { data } = useQuery(LOCAL_APP_STATE);
    if (stateMapper.length === 1) {
      return data[stateMapper[0]];
    }
    return stateMapper.map((element) => data[element]);
  };

  // This function shallow-merges a newState object
  // with the current local app state object
  const setLocalAppState = (newState) => {
    if (newState.component) {
      newState.component.props = newState.component.props ?? {};
    }
    
    const currentState = client.readQuery({
      query:LOCAL_APP_STATE
    });

    const updateState = () => {
      client.writeQuery({
        query: LOCAL_APP_STATE,
        data:{ ...currentState, ...newState }
      });
    };

    //Reset cache when users login/logout
    if(newState.user || newState.user === null){
      client.onResetStore(updateState);
      client.resetStore();
    }else{
      updateState();
    }

  };

  // This is a component that can be used in place of
  // HTML anchor elements to navigate between pages
  // in the single-page app. The `to` prop is expected to be
  // a React component (like `Home` or `TaskPage`)
  const AppLink = ({ children, to, ...props }) => {
    const handleClick = (event) => {
      event.preventDefault();
      setLocalAppState({
        component: { name: to, props },
      });
    };
    return (
      <a href={to} onClick={handleClick}>
        {children}
      </a>
    );
  };

  // In React components, the following is the object you get
  // when you make a useStore() call
  return {
    useLocalAppState,
    setLocalAppState,
    AppLink,
  };
};
