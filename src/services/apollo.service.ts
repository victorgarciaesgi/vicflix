import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AuthModule } from '@store';
import { apiProvider } from '@models';
import { LoginErrors } from '@constants';
import Logger from './logger';

// Decomment this line if server-side rendering, and add it to uploadClient
// import fetch from 'node-fetch';

export const API_URL = process.env.NUXT_ENV_API_URL;
export const APP_STAGE = process.env.NUXT_ENV_STAGE;

const errorLink = onError(({ graphQLErrors, networkError, forward, response }) => {
  const unauthorizedError =
    graphQLErrors &&
    graphQLErrors.find(
      (err) => err.message === LoginErrors.Unhauthorized || err.message === 'error:auth'
    );
  // if (unauthorizedError && process.browser) {
  //   AuthModule.actions.disconnectRequest();
  // }
  // if (networkError && response === undefined) {
  //   console.log(`[Network error]: ${networkError}`);
  //   AuthModule.updateState(() => ({ networkError: true }));
  // } else {
  //   AuthModule.updateState(() => ({ networkError: false }));
  // }
});

const contextLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

const uploadLink = createHttpLink({
  uri: API_URL,
});

const apolloLink =
  ['development', 'testing'].includes(APP_STAGE) && process.browser
    ? [contextLink, errorLink, Logger, uploadLink]
    : [contextLink, errorLink, uploadLink];

export const apolloClient = new ApolloClient({
  ssrMode: !process.browser,
  ssrForceFetchDelay: 100,
  link: ApolloLink.from(apolloLink),
  cache: new InMemoryCache(),
  connectToDevTools: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export const sgts = apiProvider(apolloClient);
