# 🍮 Purin shop 🍮

# discription
    This is an e-commerce platform selling Pompompurin product. The application have two kinds of users, regular user and admin user.
    - Admin
        - An admin can login as an admin.
        - An admin user can change if a product is available to purches.
        - An admin user can add other admin users.
    - User(regular user)
        - A user can login as an user.
        - A user can view all the avaliable items.
        - A user can add specific items to cart.
        - A user can modify items in cart.
        - A user can check out.

# Login
    - Username requirement
        - Using characters except letters and numbers are not allowed.
        - Empty input is not allowed.
        - Username 'cat' is not allowed.
    - We have two roles in this application, user and admin. 
    - Users can only sign up as users, all the new sign ups are default to the role user.
    - This applicaion have two default admin - 'admin' and 'admin1'.
    - The application will decide which content is the one for the particular user based on the user's role.
        - When login as an admin, the application will render the admin page.
        - When login as a user, the application will render the user page.

# Logout
    - Login users can logout.
    - When a user trying to do something without authorization, the system will automically logout.
        - For example, when session is deleted.
    - When a user logout, the application will render the login page.

# Admin
    - The default admin users are 'admin' and 'admin1'.
    - Admin can change the availability for each product by changing the selection.
    - Admin can add other admins
        - Empty input is not allowed.
        - Using characters except letters and numbers are not allowed.
        - Username 'cat' is not allowed
        - Excited username and default admin usernames are not allowed.
    - This page will check if there is any change every 2 seconds

# User
    - Users can see the user page includs all the available items and all the items in cart.
        - User page will check items' availability every 2 seconds.
            - I items turns not available, it won't show up in the view items part and will update the availability in cart.
    - Users can add items to cart on items listing part.
    - Users can be directed to view cart button by clicking view cart 🍮 'button'.
    - Users can modify the cart.
        - If the item is still available.
            - Clicking '+' will add one more item to the cart.
            - Clicking 'delete' the item will be removed from cart.
            - By input a new quantity and press update button, the quantity will update.
                - If input 0, that item will be removed from cart.
                - Negative numbers are not allowed.
    - Users can checkout 
        - When there are not available items in cart, users will see a window saying that some items are not available and they have been removed from cart
        - If all the items in card are available, then the cart will be cleaned up.

# Images
    All the images used in this project are owned by me.