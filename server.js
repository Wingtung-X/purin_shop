const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const users = require('./users');
const sessions = require('./sessions');
const items = require('./items');


app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());

app.get('/api/session', (req, res) => {
    const sid = req.cookies.sid;

    if (!sid) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const sessionInfo = sessions.getSessionUser(sid);

    if (!sessionInfo || !users.isValid(sessionInfo.username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    
    res.json({ username: sessionInfo.username, role: sessionInfo.role });
});


app.post('/api/session', (req, res) => {
    const { username } = req.body;

    if (!users.isValid(username)) {
        res.status(400).json({ error: 'Invalid username, you can only use numbers or letters' });
        return;
    }

    if (username === 'cat') {  // cat is not allowed
        res.status(403).json({ error: 'auth-insufficient' });
        return;
    }

    // check role
    const role = users.adminUsers.includes(username) ? 'admin' : 'user';

    const user = users.addUserData(username);
    if (user === -1) {
        res.status(409).json({ error: 'Role change not allowed' });
        return;
    }

    const sid = sessions.addSession(username, user.role);
    res.cookie('sid', sid);
    res.json(user);
});



app.delete('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    if (sid) {
        res.clearCookie('sid');
    }

    if (username) {
        sessions.deleteSession(sid);
    }

    res.json({ username });
});

// ----------------- user item operation --------------------------

app.get('/api/items', (req, res) => {
    const sid = req.cookies.sid;
    const sessionUser = sessions.getSessionUser(sid);

    if (!sid || !sessionUser || sessionUser.role !== 'user') {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const avaliableItems = items.getAvailableItems();
    res.json(avaliableItems);
});


app.post('/api/cart/add', (req, res) => {

    const sid = req.cookies.sid;
    const user = sessions.getSessionUser(sid);
    if (!sid || !user) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const itemId = String(req.body.itemId);
    const item = items.items[itemId];
    if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }

    if (!item.available) {
        res.status(409).json({ error: 'Item not available' });
        return;
    }

    users.addToCart(user.username, { id: itemId, quantity: 1 });
    const updatedCartInfo = users.calculateCartInfo(user.username);
    res.json({
        cart: user.cart,
        totalAmount: updatedCartInfo.totalAmount,
        totalItems: updatedCartInfo.totalItems
    });
});


app.get('/api/cart/get', (req, res) => {
    const sid = req.cookies.sid;
    const sessionUser = sessions.getSessionUser(sid);

    if (!sid || !sessionUser || sessionUser.role !== 'user') {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const user = users.users[sessionUser.username];
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // get new info
    const cartDisplayInfo = users.getCartDisplayInfo(sessionUser.username);
    const updatedCartInfo = users.calculateCartInfo(sessionUser.username);

    res.json({
        cart: cartDisplayInfo,
        totalAmount: updatedCartInfo.totalAmount,
        totalItems: updatedCartInfo.totalItems
    });
});


app.post('/api/user/checkout', (req, res) => {
    const sid = req.cookies.sid;
    const sessionUser = sessions.getSessionUser(sid);

    if (!sid || !sessionUser || sessionUser.role !== 'user') {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const username = sessionUser.username;
    const user = users.users[username];
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    const canCheckout = users.checkout(username);
    if (!canCheckout) { // some items are not avaliable -> conflict
        return res.status(409).json({
            error: 'some items not available at this time, they have been removed from your cart',
            cart: user.cart // updated cart
        });
    }

    res.json({
        cart: user.cart // empty cart
    });
});

app.post('/api/cart/edit', (req, res) => {
    const sid = req.cookies.sid;
    const user = sessions.getSessionUser(sid);
    if (!sid || !user) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const itemId = String(req.body.itemId);
    const number = parseInt(req.body.number, 10);
    if (isNaN(number) || number < 0) {
        res.status(400).json({ error: 'Invalid quantity' });
        return;
    }

    const item = items.items[itemId];
    if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }

    if (!item.available) {
        res.status(409).json({ error: 'Item not available' });
        return;
    }

    users.editCartNumber(user.username, itemId, number);
    const updatedCartInfo = users.calculateCartInfo(user.username);
    res.json({
        cart: user.cart,
        totalAmount: updatedCartInfo.totalAmount,
        totalItems: updatedCartInfo.totalItems
    });
});


app.delete('/api/cart/item/:itemId', (req, res) => {
    const { itemId } = req.params;
    const sid = req.cookies.sid;
    const sessionUser = sessions.getSessionUser(sid);

    if (!sid || !sessionUser) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    users.editCartNumber(sessionUser.username, itemId, 0);
    const updatedCartInfo = users.calculateCartInfo(sessionUser.username);
    res.json({
        cart: sessionUser.username.cart,
        totalAmount: updatedCartInfo.totalAmount,
        totalItems: updatedCartInfo.totalItems
    });
});


// ------------------- admin operation -------------------------

app.get('/api/items/admin', (req, res) => {
    const sid = req.cookies.sid;
    const sessionUser = sessions.getSessionUser(sid);

    if (!sid || !sessionUser || sessionUser.role !== 'admin') {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const itemlist = items.getAllItems();
    res.json(itemlist);
});


app.post('/api/items/availability', (req, res) => {
    const sid = req.cookies.sid;
    const sessionUser = sessions.getSessionUser(sid);

    if (!sid || !sessionUser) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const { username, role } = sessionUser;

    if (!username || !users.isValid(username)) {
        res.status(401).json({ error: 'Invalid username' });
        return;
    }

    const user = users.getUserData(username);
    if (!user || role !== 'admin') {
        res.status(403).json({ error: 'Not authorized' });
        return;
    }

    const { id, available } = req.body;
    const updatedItem = items.setItemAvailability(id, available);
    if (!updatedItem) {
        res.status(404).json({ error: 'Item not found or update failed' });
        return;
    }

    res.json({
        item: updatedItem,
    });
});

app.post('/api/admin/add', (req, res) => {
    const { newname } = req.body;
    const sid = req.cookies.sid;
    const sessionUser = sessions.getSessionUser(sid);

    if (!sid || !sessionUser) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const { username, role } = sessionUser;

    if (!username || !users.isValid(username)) {
        res.status(401).json({ error: 'Invalid username' });
        return;
    }

    const user = users.getUserData(username);
    if (!user || role !== 'admin') {
        res.status(403).json({ error: 'Not authorized' });
        return;
    }

    // Check if the username is already taken by a user
    if (users.users[newname]) {
        res.status(409).json({ error: 'Username is already taken by a user' });
        return;
    }

    // Check if the username is already an admin
    if (users.adminUsers.includes(newname)) {
        res.status(409).json({ error: 'Username is already taken by an admin' });
        return;
    }

    if (!users.isValid(newname)) {
        res.status(409).json({ error: 'Not a valid username' });
        return;
    }

    const addedAdmin = users.addAdmin(newname);
    res.json(addedAdmin);
});





app.listen(PORT, () => console.log(`http://localhost:${PORT}`)); 