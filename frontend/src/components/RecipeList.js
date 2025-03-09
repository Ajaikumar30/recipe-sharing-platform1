import TrueFocus from './TrueFocus';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';
import Navbar from './NavBar';
import '../styles/RecipeList.css';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState(null);
    const clearRecipes = () => {
        setRecipes([]); // This clears the UI but keeps recipes in the database
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const recipesRes = await axios.get('http://localhost:5000/api/recipes');
                setRecipes(recipesRes.data);

                if (token) {
                    const userRes = await axios.get('http://localhost:5000/api/auth/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserId(userRes.data._id);
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, [token]);

    const handleDelete = (id) => {
        setRecipes(recipes.filter(recipe => recipe._id !== id));
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
    };

    const handleUpdate = (updatedRecipe) => {
        setRecipes(recipes.map(recipe => recipe._id === updatedRecipe._id ? updatedRecipe : recipe));
        setEditingRecipe(null);
    };

    return (
        <div className="container mt-4">
            <TrueFocus
                sentence="Welcome to the Recipe Platform"
                manualMode={false}
                blurAmount={5}
                borderColor="red"
                animationDuration={0.5}
                pauseBetweenAnimations={0.2}
            />

            
            {/* <button className="btn btn-danger mb-3" onClick={clearRecipes}>Clear Live Recipes</button> */}
            {/* <RecipeForm editingRecipe={editingRecipe} onUpdate={handleUpdate} /> */}
             <Navbar />
             <h1 style={{fontFamily: '', fontSize: 30}}>Live Recipes ⭕</h1>
            <div className="row">
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <div className="col-md-4 mb-4" key={recipe._id}>
                            <RecipeCard recipe={recipe} onDelete={handleDelete} onEdit={handleEdit} isOwner={userId === recipe.user} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">No recipes found.</p>
                )}
            </div>
        </div>
    );
};

export default RecipeList;
