import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import demoApp from './demoApp';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.REACT_APP_RECOMMENDATION_URI,
  cache: new InMemoryCache(),
  headers: {
    'api-key': process.env.REACT_APP_API_KEY,
  },
});

const Main = () => (
  <ApolloProvider client={client}>
    <demoApp />
  </ApolloProvider>
);

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
