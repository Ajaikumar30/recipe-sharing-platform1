import React from 'react';
import axios from 'axios';

const RecipeCard = ({ recipe, onDelete, onEdit, isOwner }) => {
    const token = localStorage.getItem('token');

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/recipes/${recipe._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onDelete(recipe._id);
        } catch (error) {
            alert('Failed to delete recipe');
        }
    };

    return (
        <div className="card recipe-card">
            {recipe.image && <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="card-img-top recipe-image" />}
            <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
                <p><strong>Instructions:</strong> {recipe.instructions}</p>
                
                {isOwner && (
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-warning btn-sm" onClick={() => onEdit(recipe)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeCard;
