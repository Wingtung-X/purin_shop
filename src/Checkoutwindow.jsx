function Checkoutwindow({ onClose, onContinue, message }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <p>{message}</p>
                <button className="window__button" onClick={onClose}>Back</button>
                <button className="window__button" onClick={onContinue}>Continue Checkout</button>
            </div>
        </div>
    );
}

export default Checkoutwindow;