let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let app = express();
let PORT = 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: 'BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Get All Restaurants
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);

  return { restaurants: response };
};

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found!' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//  Get Restaurant by ID
async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.get(query, [id]);

  return { restaurant: response};
};

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;

  try {
    let results = await fetchRestaurantById(id);
    if (results.restaurant === undefined) {
      return res.status(404).json({ message: 'No hotel found with id: ' + id});
    }
    res.status(200).json(results);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get Restaurants by Cuisine
async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
};

app.get ('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let results = await fetchRestaurantsByCuisine(cuisine);

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found for cuisine: ' + cuisine});
    }

    res.status(200).json(results);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
});

//  Get Restaurants by Filter

async function fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query = 'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
};

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;

  try {
    let results = await fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found with requested filter!'});
    }

    res.status(200).json(results);
  } catch(error){
    return res.status(500).json({ error: error.message });
  }
});

// Get Restaurants Sorted by Rating
async function sortAllRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);

  return { restaurants: response };
};

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortAllRestaurantsByRating();

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found!' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get All Dishes
async function fetchAlDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);

  return { dishes: response };
};

app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAlDishes();

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found!' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//  Get Dish by ID
async function fetchDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.get(query, [id]);

  return { dish: response};
};

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;

  try {
    let results = await fetchDishById(id);
    if (results.dish === undefined) {
      return res.status(404).json({ message: 'No dish found with id: ' + id});
    }
    res.status(200).json(results);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get Dishes by Filter
async function fetchDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);

  return { dishes: response };
};

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;

  try {
    let results = await fetchDishesByFilter(isVeg);

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found with requested filter!'});
    }

    res.status(200).json(results);
  } catch(error){
    return res.status(500).json({ error: error.message });
  }
});

// Get Dishes Sorted by Price
async function sortAllDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);

  return { dishes: response };
};

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await sortAllDishesByPrice();

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found!' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});