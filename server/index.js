const express = require('express');
const cors = require('cors');
const recipes = require('./recipes.json');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
   res.send('Backend is running');
});

app.get('/recipes', (req, res) => {
   res.json(recipes.recipes);
});

app.listen(5000, () => {
   console.log('Server listening on port 5000');
});
