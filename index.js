const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
methodOverride = require('method-override'),
mongoose = require('mongoose'),
Models = require('./models.js'),
Movies = Models.Movie,
Users = Models.User,
Directors = Models.Director,
Genres = Models.Genre;

// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const {check, validationResult} = require('express-validator');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('common'));

app.use(bodyParser.urlencoded({
  extended: true
}));
const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(alloweOrigins.indexOf(origin) === -1){
      let message = "The CORS policy for this appication doesn't allow access form origin " + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, ture);
  }
}));
//imports authentication code
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.get('/', (req, res) => {
  res.send('My top 10 favorite movies!');
});
//get request for all movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch(( err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});
//get request for all directors
app.get('/directors', (req, res) => {
  Directors.find()
  .then((director) => {
    res.status(201).json(director);
  })
  .catch(( err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});
//shows get request for directors by name
app.get('/Director/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
  .then((director) => {
    res.json(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});
//get request for all genres
app.get('/genres', (req, res) => {
  Genres.find()
  .then((genres) => {
    res.status(201).json(genres);
  })
  .catch(( err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});
//shows get request for genres by name
app.get('/Genre/:Name', (req, res) => {
  Genres.findOne({ Name: req.params.Name })
  .then((genre) => {
    res.json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});
//shows get request for movie titles
app.get('/movie/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});
//Adds new movie
app.post('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.body.Title })
  .then((movie) => {
    if (movie) {
      return res.status(400).send(req.body.Title + 'already exists');
    } else {
      Movies
      .create({
        Title: req.body.Title,
        Description: req.body.Description,
        Director: req.body.Director,
        Genre: req.body.Genre,
        ImagePath: req.body.ImagePath,
        Actors: req.body.Actors,
        Featured: req.body.Featured
      })
      .then((movie) => {res.status(201).json(movie) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error ' + error);
  });
});
//Get all users
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});
//GET users by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((users) => {
    res.json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// update a users username
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {$set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
//Adds a new user
app.post('/users', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error ' + error);
  });
});
//Adds a movie to a user's favorites list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
//Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// Deletes a movie from our list by title
app.delete('/movie/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOneAndRemove({ Title: req.params.Title })
  .then((movie) => {
    if (!movie) {
      res.status(400).send(req.params.Title + ' was not found');
    } else {
      res.status(200).send(req.params.Title + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// deletes a users email
app.delete('/users/:email', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Email: req.params.Email })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Email + ' was not found');
    } else {
      res.status(200).send(req.params.Email + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
