import ItemcardUser from './ItemcardUser';

function UserCards({ items, onAddToCart }) {
  return (
    <div className="user-cards">
      {items.map(item => (
        <ItemcardUser key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

export default UserCards;
