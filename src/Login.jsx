import { useState } from 'react';

function Login({ onLogin, setError }) {
    const [username, setUsername] = useState('');

    function onSubmit(e) {
        e.preventDefault();
        setError('');
        if (username) {
            onLogin(username, 'user');  // new user can only have role user
        } else {
            setError('Empty input is not allow');
        }
    }

    return (
        <div className="login">
            <form className="login__form" onSubmit={onSubmit}>
                <label>
                    <span>Username:</span>
                    <input type="text" className="login__username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <button className="login__button" type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
