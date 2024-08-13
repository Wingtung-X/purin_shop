import { useState, useEffect } from 'react'
import './App.css'
import Admin from './Admin';
import User from './User';
import Login from './Login';
import Header from './Header';
import Footer from './Footer';

import {
  fetchSession,
  fetchLogin,
  fetchLogout,
} from './services';


import {
  LOGIN_STATUS,
  CLIENT,
  SERVER,
} from './constants';

function App() {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [loginStatus, setLoginStatus] = useState(LOGIN_STATUS.NOT_LOGGED_IN);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('');

  function onLogin(username, role) {
    setError('');
    setIsLoading(true);
    fetchLogin(username, role)
      .then(userData => {
        setError('');
        setUsername(userData.username);
        setRole(userData.role);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err?.error || 'An unexpected error occurred');
        setIsLoading(false);
      });
  }


  function checkForSession() {
    setIsLoading(true);
    fetchSession()
      .then(session => {
        setUsername(session.username);
        setRole(session.role);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
      })
      .catch(err => {
        if (err?.error === SERVER.AUTH_MISSING) {
          setUsername('');
          setRole('');
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
          return Promise.reject({ error: CLIENT.NO_SESSION })
        }
        return Promise.reject(err);
      })
  }

  function onLogout() {
    setIsLoading(true);
    fetchLogout().then(() => {
      setUsername('');
      setRole('');
      setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
      setIsLoading(false);
    }).catch(err => {
      setError(err?.error || 'ERROR');
      setIsLoading(false);
    });
  }

  useEffect(
    () => {
      checkForSession();
    },
    []
  );

  return (
    <>
      <Header />
      <div className='main'>
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN ? (
          <>
            {role === 'admin' ? (
              <Admin
                isLoggedIn={loginStatus === LOGIN_STATUS.IS_LOGGED_IN}
                setLoginStatus={setLoginStatus}
                checkForSession={checkForSession}
              />

            ) : (
              <User
                isLoggedIn={loginStatus === LOGIN_STATUS.IS_LOGGED_IN}
                setLoginStatus={setLoginStatus}
                checkForSession={checkForSession}
              />
            )}
            <button className='logout__button' onClick={onLogout}>logout</button>
          </>
        ) : (
          <Login 
          onLogin={onLogin}
          setError={setError}
          />
        )}
        {error && <p className='error'>{error}</p>}
      </div>
      <Footer />
    </>
  )
}

export default App
