import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css'; // Custom CSS

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed!');
        }
    };

    return (
        <div className="container auth-container">
            <div className="card p-4 shadow-lg">
                <h2 className="text-center">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Name" 
                            onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Email" 
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" placeholder="Password" 
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
