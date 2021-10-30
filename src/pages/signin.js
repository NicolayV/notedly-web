import React, { useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import UserForm from '../components/UserForm';

import { SIGNIN_USER } from '../gql/mutation';

const SignIn = props => {
  useEffect(() => {
    // Обновляем заголовок документа
    document.title = 'Sign In — Notedly';
  });
  const client = useApolloClient();
  const [signIn, { loading, error }] = useMutation(SIGNIN_USER, {
    onCompleted: data => {
      // Сохраняем токен
      localStorage.setItem('token', data.signIn);
      // Обновляем локальный кэш
      client.writeData({ data: { isLoggedIn: true } });
      // Перенаправляем пользователя на домашнюю страницу
      props.history.push('/');
    }
  });
  return (
    <React.Fragment>
      <UserForm action={signIn} formType="signIn" />
      {/* Если данные загружаются, отображаем сообщение о загрузке */}{' '}
      {loading && <p>Loading...</p>}
      {/* Если при загрузке произошел сбой, отображаем сообщение об ошибке */}{' '}
      {error && <p>Error signing in!</p>}
    </React.Fragment>
  );
};
export default SignIn;
