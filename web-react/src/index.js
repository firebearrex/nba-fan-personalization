import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
// import CssBaseline from '@mui/material/CssBaseline';
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
  <BrowserRouter>
    <ApolloProvider client={client}>
      {/*<CssBaseline />*/}
      <App />
    </ApolloProvider>
  </BrowserRouter>
);

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
