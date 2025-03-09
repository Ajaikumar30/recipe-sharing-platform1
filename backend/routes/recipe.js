const express = require('express');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authmiddleware');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// 📌 1. Create a Recipe (Protected)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, ingredients, instructions } = req.body;
        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save image path

        const recipe = new Recipe({
            title,
            ingredients: ingredients.split(','), // Convert string to array
            instructions,
            image: imageUrl,
            user: req.user.id
        });

        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.use('/uploads', express.static('uploads'));
// 📌 Get Recipes Created by the Logged-in User
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.id });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// 📌 2. Get All Recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('user', 'name email');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 📌 3. Get a Single Recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('user', 'name email');
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 📌 4. Update a Recipe (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

        if (recipe.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { title, ingredients, instructions, image } = req.body;
        recipe.title = title || recipe.title;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        recipe.image = image || recipe.image;

        await recipe.save();
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 📌 5. Delete a Recipe (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

        if (recipe.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await recipe.deleteOne();
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// 📌 Delete All Recipes (Only for Testing Purposes)
router.delete('/clear-all', async (req, res) => {
    try {
        await Recipe.deleteMany({});
        res.json({ message: 'All recipes have been deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
