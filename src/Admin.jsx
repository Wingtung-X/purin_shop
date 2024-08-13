import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllItems, fetchUpdateItemAvailability, fetchSession, fetchAddAdmin } from './services';

import {
  LOGIN_STATUS,
  CLIENT,
  SERVER,
} from './constants';

function Admin({ isLoggedIn, setLoginStatus, checkForSession }) {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const pollingRef = useRef();


  useEffect(
    () => {
      checkForSession()

      fetchAllItems()
        .then(items => {
          setItems(items);
        })
        .catch((err) => {
          setError(err?.error || 'Failed to fetch items');
        })
    },
    [] // Only run on initial render
  );


  const pollItems = useCallback(() => {
    fetchAllItems()
      .then(items => {
        setItems(items);
      })
      .then(() => {
        pollingRef.current = setTimeout(pollItems, 2000);
      })
      .catch((err) => {
        setError(err?.error || 'Failed to fetch items');
        pollingRef.current = setTimeout(pollItems, 2000); // We try again despite error
      });

  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      pollingRef.current = setTimeout(pollItems, 2000);
    }
    return () => {
      clearTimeout(pollingRef.current); // Causes no errors if there is no such timeout
    };
  }, [isLoggedIn, pollItems]);

  function onUpdate(id, available) {
    fetchSession()
      .then(() => {
        fetchUpdateItemAvailability(id, available)
          .then(() => {
            fetchAllItems().then(setItems);
          })
      }).catch(err => {
        if (err?.error === SERVER.AUTH_MISSING) {
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        }
      });
  }

  function onAddAdmin(newname) {
    fetchSession()
      .then(() => {
        fetchAddAdmin(newname)
          .then(() => {
            setInputValue('');
            setError('');
          })
          .catch(err => {
            setError(err?.error || 'Failed to add admin');
          });
      })
      .catch(err => {
        if (err?.error === SERVER.AUTH_MISSING) {
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        }
      });
  }


  function onSubmit(e) {
    e.preventDefault();
    const input = inputValue.trim();

    if (input === '') { //front end validation
      setError('Admin name cannot be empty');
      return;
    }

    if (input === 'cat') { //front end validation
      setError('Cat is not allowed!');
      return;
    }

    onAddAdmin(input);
  }


  return (
    <div className='admin__portal'>
      <h2>Edit availability</h2>
      {items.map((item) => (
        <div className='admin__available' key={item.id}>
          <span>{item.name}</span>
          <select className='admin_select' onChange={(e) => onUpdate(item.id, e.target.value === 'true')} value={item.available}>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
      ))}
      <h2>Add admin</h2>
      <form className="addadmin__form" onSubmit={onSubmit}>
        <label>
          <span>Name:</span>
          <input
            className="admin__input"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
          />
        </label>
        <button className="addadmin__button" type="submit">Add</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Admin;
