function ItemcardUser({ item, onAddToCart }) {
  return (
    <div className={`item${item.id}card card`}>
      <img className="item__image" src={item.pic} alt={item.name} />
      <h3 className='item__name'>{item.name}</h3>
      <p className='item__price'>Price: ${item.price}</p>
      <div className='item__description'>
        <p>Description:</p>
        <p>{item.description}</p>
      </div>
      <button className='cardbutton' onClick={() => onAddToCart(item)}>Add to Cart</button>
    </div>
  );
}

export default ItemcardUser;