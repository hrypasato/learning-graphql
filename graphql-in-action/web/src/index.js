
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/Root';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client';
import * as config from './config';
import { setContext } from '@apollo/link-context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { LOCAL_APP_STATE } from './store';
import { getMainDefinition } from '@apollo/client/utilities';

const authLink = setContext((_, { headers }) => {
    const { user } = client.readQuery({ query:LOCAL_APP_STATE });
    return {
        headers:{
            ...headers,
            authorization: user ? `Bearer ${user.authToken}` : ''
        }
    }
});

const httpLink = new HttpLink({ uri: config.GRAPHQL_SERVER_URL });
const cache = new InMemoryCache();

const wsLink = new WebSocketLink({
    uri:config.GRAPHQL_SUBSCRIPTIONS_URL,
    options:{ reconnect: true }
});
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink)
);

const client = new ApolloClient({ link: splitLink, cache });

const initialLocalAppState = {
    component: { name:'Home', props:{} },
    user: JSON.parse(window.localStorage.getItem('azdev:user'))
};

client.writeQuery({
    query: LOCAL_APP_STATE,
    data: initialLocalAppState
})

export default function App() {
    return (
        <ApolloProvider client={client}>
            <Root/>
        </ApolloProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));