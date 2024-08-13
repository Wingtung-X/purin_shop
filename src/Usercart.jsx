import { useState } from 'react';

function UserCart({ cartItems, onCheckout, totalPrice, totalItems, onUpdateQuantity, onDelete, onAddToCart, setError, error }) {
  const [inputValues, setInputValues] = useState({});

  const handleQuantityChange = (id, value) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  const onSubmit = (id) => {
    const quantity = inputValues[id];
    if (!isNaN(quantity) && quantity >= 0) {
      onUpdateQuantity(id, parseInt(quantity), setError);
      setInputValues(prev => ({ ...prev, [id]: '' }));
    } else {
      setError('Please enter a valid quantity.');
    }
  };

  return (
    <div className="user-cart">
      <h2>Shopping Cart</h2>
      {error && <p className="error">{error}</p>}
      <ul className='cart-ul'>
        {cartItems.map(item => (
          <li key={item.id} className='cart-li'>
            <span className='cart__info__change'>
              <p>Name: {item.name}, Price: ${item.price}, Available: {item.available ? 'Yes' : 'No'}, Quantity: {item.quantity}</p>
              <button className='plus__sign' onClick={(e) => {
                setError('');
                onAddToCart(item);
              }}> + </button>
              <button className='cart__delete__item' onClick={(e) => {
                onDelete(item.id);
                setError('');
              }}>Delete</button>
            </span>
            <form className='cart_form' onSubmit={(e) => {
              e.preventDefault();
              onSubmit(item.id);
            }}>
              <input
                type="number"
                value={inputValues[item.id] || ''}
                placeholder="Enter new quantity"
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              />
              <button className='cart_quantity_button' type="submit">Update</button>
            </form>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <p>Total Items: {totalItems}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
      </div>
      <button className='checkout__button' onClick={onCheckout}>Checkout</button>
    </div>
  );
}

export default UserCart;
