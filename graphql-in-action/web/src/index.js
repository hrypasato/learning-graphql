
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/Root';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import * as config from './config';
import { setContext } from '@apollo/link-context';
import { LOCAL_APP_STATE } from './store';

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
const client = new ApolloClient({ link: authLink.concat(httpLink), cache });

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