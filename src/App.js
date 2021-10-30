import React from 'react';
import ReactDOM from 'react-dom';

// Импортируем маршруты
import Pages from './pages';
// Глобальные стили
import GlobalStyle from './components/GlobalStyle';

// Импортируем библиотеки Apollo Client
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client';
import { setContext } from 'apollo-link-context';

// Настраиваем API URI и кэш
const uri = process.env.API_URI;
const cache = new InMemoryCache();
const httpLink = createHttpLink({ uri });

// Проверяем наличие токена и возвращаем заголовки в контекст
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || ''
    }
  };
});

// Настраиваем Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  uri,
  cache,
  resolvers: {},
  connectToDevTools: true
});

// Проверем наличие локального токена
const data = {
  isLoggedIn: !!localStorage.getItem('token')
};

// Записываем данные кэша при начальной загрузке
cache.writeData({ data });
// Записываем данные кэша после его сброса
client.onResetStore(() => cache.writeData({ data }));

const App = () => {
  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <Pages />
    </ApolloProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
