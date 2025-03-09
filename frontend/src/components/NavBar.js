import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = () => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.body.className = theme === 'light' ? 'dark-theme' : 'light-theme';
    };

    return (
        <nav className={`navbar navbar-light bg-light justify-content-between px-5 ${theme}`} style={{ marginBottom: '50px', marginTop: '20px', borderRadius: '10px' }}>
            <h2 className="navbar-brand mx-3">Recipe Sharing Platform</h2>
            <div>
                <Link to="/login" className="btn btn-outline-primary mx-2">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
                <button onClick={toggleTheme} className="btn btn-secondary mx-2" style={{ transition: 'transform 0.5s ease' }}>
                    {theme === 'light' ? <FaMoon style={{ transform: 'rotate(0deg)' }} /> : <FaSun style={{ transform: 'rotate(360deg)' }} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
