import { useState, useEffect, useCallback, useRef } from 'react';
import UserCards from './UserCards';
import UserCart from './Usercart';
import Checkoutwindow from './Checkoutwindow';

import {
  fetchAvailableItems,
  fetchAddToCart,
  fetchUserCart,
  fetchCheckout,
  fetchSession,
  fetchEditCartNumber,
  fetchDeleteItem,
} from './services';

function User({ isLoggedIn, setLoginStatus, checkForSession }) {
  const [items, setItems] = useState([]);
  const [cartInfo, setCartInfo] = useState({ cartItems: [], totalPrice: 0, totalItems: 0 });
  const [viewCart, setViewCart] = useState(false);
  const [error, setError] = useState('');

  const [showWindow, setShowWindow] = useState(false);
  const [windowContent, setWindowContent] = useState('');

  const pollingRef = useRef();

  useEffect(
    () => {
      checkForSession();
      Promise.all([fetchAvailableItems(), fetchUserCart()])
      .then(([items, cartData]) => {
        setItems(items);
        setCartInfo({ cartItems: cartData.cart, totalPrice: cartData.totalAmount, totalItems: cartData.totalItems });

      })
      .catch((err) => {
        setError(err?.error || 'Failed to fetch data');  
      });
      
    },
    [] // Only run on initial render
  );


  const pollItems = useCallback(() => {
    Promise.all([fetchAvailableItems(), fetchUserCart()])
      .then(([items, cartData]) => {
        setItems(items);
        setCartInfo({ cartItems: cartData.cart, totalPrice: cartData.totalAmount, totalItems: cartData.totalItems });

      })
      .then(() => {
          pollingRef.current = setTimeout(pollItems, 2000); 
      })
      .catch((err) => {
        setError(err?.error || 'Failed to fetch data');  
        pollingRef.current = setTimeout(pollItems, 2000); 
      });
  }
    , []);

  useEffect(() => {
    if (isLoggedIn) {
      pollingRef.current = setTimeout( pollItems, 2000 );
    }
    return () => {
      clearTimeout(pollingRef.current);
    };
  }, [isLoggedIn, pollItems]);

  function onAddToCart(item) {
    return fetchSession()
      .then(() => {
        return fetchAddToCart(item.id)
          .then(() => {
            return fetchUserCart();
          })
          .then(data => {
            setCartInfo({
              cartItems: data.cart,
              totalPrice: data.totalAmount,
              totalItems: data.totalItems
            });
            setError('');
            return true;
          })
          .catch(err => {
            setError(err?.error || 'Failed to add item to cart. Please try again.');
            return false;
          });
      })
      .catch(() => {
        setLoginStatus(false);
        return false;
      });
  }


  // -------- edit cart -------
  function onUpdateQuantity(itemId, number, setError) {
    fetchSession()
      .then(() => {
        fetchEditCartNumber(itemId, number)
          .then(() => fetchUserCart())
          .then(data => {
            setCartInfo({
              cartItems: data.cart,
              totalPrice: data.totalAmount,
              totalItems: data.totalItems
            });
            setError('');
          })
          .catch(err => {
            setError(err?.error || 'Failed to update quantity. Please try again.');
          });
      })
      .catch(err => {
        setLoginStatus(false);
      });
  }

  function onDelete(itemId) {
    fetchSession()
      .then(() => {
        fetchDeleteItem(itemId)
          .then(() => {
            fetchUserCart()
              .then(data => {
                setCartInfo({
                  cartItems: data.cart,
                  totalPrice: data.totalAmount,
                  totalItems: data.totalItems
                });
                setError('');
              })
              .catch(err => {
                setError(err?.error || 'Failed to refresh cart. Please try again.');
              });
          })
          .catch(err => {
            setError(err?.error || 'Failed to delete item. Please try again.');
          });
      })
      .catch(() => {
        setLoginStatus(false);
      });
  }


  function onCheckout() {
    setError('');
    fetchSession()
      .then(() => {
        fetchCheckout()
          .then(() => {
            setCartInfo({ cartItems: [], totalPrice: 0, totalItems: 0 });
            if (showWindow) {
              setShowWindow(false);
            }
          })
          .then(() => {
            return fetchUserCart();
          })
          .then(updatedCart => {
            setCartInfo({ cartItems: updatedCart.cart, totalPrice: updatedCart.totalAmount, totalItems: updatedCart.totalItems });
            setError('');
          })
          .catch(err => {
            setError(err?.error || 'Failed to checkout or update cart');
            setWindowContent("Some Items are not avaliable and they have been removed from cart.")
            setShowWindow(true);
          });
      })
      .catch(err => {
        setError('Session expired or network issue. Please log in again or check your connection.');
        setLoginStatus(false);
      });
  }


  function onClose() {
    fetchSession()
      .then(() => {
        setShowWindow(false);
      })
      .catch(() => setLoginStatus(false));
  }

  function onClick() {
    fetchSession()
      .then(() => {
        setViewCart(!viewCart);
      })
      .catch(() => { setLoginStatus(false); })
  }


  return (
    <div>
      <a href="#view_cart_id" className="floatingButton">
        <span>View</span>
        <span>Cart</span>
        <span>&#x1F36E;</span>
      </a>
      <UserCards items={items} onAddToCart={onAddToCart} />
      <button onClick={onClick} id="view_cart_id">view cart</button>
      {
        viewCart ? (<UserCart cartItems={cartInfo.cartItems}
          onCheckout={onCheckout}
          totalPrice={cartInfo.totalPrice}
          totalItems={cartInfo.totalItems}
          onUpdateQuantity={onUpdateQuantity}
          onDelete={onDelete}
          onAddToCart={onAddToCart}
          setError={setError}
          error={error}
        />)
          : (<></>)
      }

      {showWindow && (
        <Checkoutwindow
          onClose={onClose}
          onContinue={onCheckout}
          message={windowContent}
        />
      )}

    </div>
  );
}

export default User;
