import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import RecipeForm from '../components/RecipeForm';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [userRecipes, setUserRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user details
                const userRes = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userRes.data);

                // Fetch user recipes
                const recipesRes = await axios.get('http://localhost:5000/api/recipes/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserRecipes(recipesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchUserData();
    }, [token]);

    const handleDelete = async (id) => {
        setUserRecipes(userRecipes.filter(recipe => recipe._id !== id));
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
    };

    const handleUpdate = (updatedRecipe) => {
        setUserRecipes(userRecipes.map(recipe => recipe._id === updatedRecipe._id ? updatedRecipe : recipe));
        setEditingRecipe(null);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Dashboard</h1>
            
            {/* Welcome Message */}
            <h3 className="text-center text-primary">
                Welcome, {user ? user.name : 'Loading...'}! 🎉
            </h3>

            {/* Add Recipe Form in Dashboard */}
            <RecipeForm editingRecipe={editingRecipe} onUpdate={handleUpdate} />
            
            <h3 className="mt-4">Your Recipes</h3>
            <div className="row">
                {userRecipes.length > 0 ? (
                    userRecipes.map(recipe => (
                        <div className="col-md-4 mb-4" key={recipe._id}>
                            <RecipeCard recipe={recipe} onDelete={handleDelete} onEdit={handleEdit} isOwner={true} />
                        </div>
                    ))
                ) : (
                    <p className="text-muted text-center">You haven't added any recipes yet.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
