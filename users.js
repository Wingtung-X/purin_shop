// name, role, cart[{}], total item number, total price 
const { items } = require('./items.js');

const users = {};

const adminUsers = ['admin', 'admin1'];


function isValid(username) {
    return !!username && username.trim() && username.match(/^[A-Za-z0-9_]+$/);
} 

function getUserData(username) {
    return users[username];
}


function addUserData(username) {
    if (users[username]) {
        return users[username]; //user exits
    }
    
    const role = adminUsers.includes(username) ? 'admin' : 'user';
    
    users[username] = {
        username,
        role,
        cart: [], 
        totalPrice: 0,
        totalItemNumbers: 0,
    };
    return users[username];
}


function addToCart(username, newItem) {
    const user = users[username];

    const item = items[newItem.id];
    if (!item.available) {
        return {error:'not avaliable item'};
    }
    const existingItemIndex = user.cart.findIndex(cartItem => cartItem.id === newItem.id);
    if (existingItemIndex !== -1) {
        user.cart[existingItemIndex].quantity += 1;
    } else {
        user.cart.push({
            id:item.id,
            quantity: 1 
        });
    }

    const updatedCartInfo = calculateCartInfo(username);
    user.totalItemNumbers = updatedCartInfo.totalItems;
    user.totalPrice = updatedCartInfo.totalAmount;
}


function getCartDisplayInfo(username) {
    const user = users[username];
    return user.cart.map(cartItem => {
        const item = items[cartItem.id];
        return {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            available: item.available,
            pic: item.pic,
            quantity: cartItem.quantity
        };
    });
}

// calculate numbers of items in cart and total price
function calculateCartInfo(username) {
    const user = users[username];
    if (!user) return { totalAmount: 0, totalItems: 0 };

    let totalAmount = 0;
    let totalItems = 0;

    user.cart.forEach(item => {
        const product = items[item.id];
        if (product && product.available) {
            totalAmount += product.price * item.quantity;
            totalItems += item.quantity;
        }
    });

    return { totalAmount, totalItems };
}

function checkout(username){
    const user = users[username];
    if (!user) return { totalAmount: 0, totalItems: 0 };

    const unavaliable = user.cart.filter(item => !items[item.id].available);

    if(unavaliable.length !== 0) { //some of the item not avaliable
        user.cart = user.cart.filter(item => items[item.id].available);//remove not avaliable from cart
        return false;
    }

    user.cart = []; 
    user.totalPrice = 0;
    user.totalItemNumbers = 0;
    return true;
}


function addAdmin(username) {
    adminUsers.push(username);
    return username;
}

function editCartNumber(username, itemId, number) {
    const user = users[username];
    const cartItemIndex = user.cart.findIndex(cartItem => cartItem.id === itemId);

    if (number <= 0) {
        user.cart.splice(cartItemIndex, 1); 
    } else {
        user.cart[cartItemIndex].quantity = number;  
    }

    const updatedCartInfo = calculateCartInfo(username);
    user.totalItemNumbers = updatedCartInfo.totalItems;
    user.totalPrice = updatedCartInfo.totalAmount;

    return { cart: user.cart };
}


module.exports = {
    users,
    adminUsers,
    isValid,
    addToCart,
    addUserData,
    getUserData,
    calculateCartInfo, 
    getCartDisplayInfo,
    checkout,
    addAdmin,
    editCartNumber
};

