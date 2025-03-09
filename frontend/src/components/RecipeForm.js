import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeForm = ({ editingRecipe, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (editingRecipe) {
            setTitle(editingRecipe.title);
            setIngredients(editingRecipe.ingredients.join(', '));
            setInstructions(editingRecipe.instructions);
        } else {
            setTitle('');
            setIngredients('');
            setInstructions('');
        }
    }, [editingRecipe]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('ingredients', ingredients);
        formData.append('instructions', instructions);
        if (image) formData.append('image', image);

        try {
            let res;
            if (editingRecipe) {
                res = await axios.put(`http://localhost:5000/api/recipes/${editingRecipe._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await axios.post('http://localhost:5000/api/recipes', formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
            }

            onUpdate(res.data);
        } catch (error) {
            alert('Error saving recipe!');
        }
    };

    return (
        <div className="card p-4 shadow-lg">
            <h4>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h4>
            <form onSubmit={handleSubmit}>
                <input type="text" className="form-control mb-2" placeholder="Recipe Title"
                    value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="text" className="form-control mb-2" placeholder="Ingredients (comma separated)"
                    value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
                <textarea className="form-control mb-2" placeholder="Instructions"
                    value={instructions} onChange={(e) => setInstructions(e.target.value)} required></textarea>
                <input type="file" className="form-control mb-2" accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit" className="btn btn-primary w-100">{editingRecipe ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default RecipeForm;
