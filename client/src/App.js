import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Header from './components/Structure/Header';
import Main from './components/Structure/Main';
import Footer from './components/Structure/Footer';

import { StoreProvider } from './utils/GlobalState';

// Construct our main GraphQL API endpoint
const httpLink = new HttpLink({
  uri: "/graphql",
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header.
// The setContext() function takes the GraphQL request being executed and the previous context and returns an object to set the new context of a request.
const authLink = setContext((_, { headers }) => {
  // Retrieve the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // Return the HTTP headers to the context so httpLink can read them.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Initialize ApolloClient, passing its constructor a configuration object with link and cache fields.
const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  // Apollo Client uses InMemoryCache to cache query results after fetching them.
  cache: new InMemoryCache(),
});

// Wrap the React app with an ApolloProvider component to connect the Apollo Client to React.
function App () {
  return (
    <ApolloProvider client={client}>
      {/* A <BrowserRouter> stores the current location in the browser's address bar using clean URLs and navigates using the browser's built-in history stack. */}
      <Router>
        <div className="app" id="app">
          <StoreProvider>
            <Header />
            <Main />
            <Footer />
          </StoreProvider>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;