const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  methodOverride = require('method-override');

const app = express();

let users = [
  {
    email: "test@test.com",
    username: 'testyMcTester',
    favoriteList: [
      {
        id: '',
        title: '',
        director: '',
        genre: '',
      }
    ]
    }
]

let movies = [
  {
    id: "",
    title: 'A Scanner Darkly',
    director: 'Richard Linklater',
    genre: 'Animation, Crime, Drama, Sci-fi',
  },{
    id: "",
    title: 'Blazing Saddles',
    director: 'Mel Brooks',
    genre: 'Comedy, Western',
  },{
    id: "",
    title: 'Fear and Loathing in Las Vegas',
    director: 'Terry Gilliam',
    genre: 'Adventure, Comedy, Drama',
  },{
    id: "",
    title: 'Jay and Silent Bob Strike Back',
    director: 'Kevin Smith',
    genre: 'Comedy',
  },{
    id: "",
    title: 'Jurassic Park',
    director: 'Steven Spielberg',
    genre: 'Action, Adventure, Sci-fi',
  },{
    id: "",
    title: 'Lord of the Rings Trilogy',
    director: 'Peter Jackson',
    genre: 'Action, Adventure, Drama, Fantasy',
  },{
    id: "",
    title: 'Star Trek III: The Search for Spock',
    director: 'Leonard Nimoy',
    genre: 'Action, Adventure, Sci-fi',
  },{
    id: "",
    title: 'Super Troopers',
    director: 'Jay Chandrasekhar',
    genre: 'Comedy, Crime, Mystery',
  },{
    id: "",
    title: 'Talladega Nights:  The Ballad of Ricky Bobby',
    director: 'Adam McKay',
    genre: 'Comedy, Sport',
  },{
    id: "",
    title: 'Thor: Ragnarok',
    director: 'Taika Waititi',
    genre: 'Action, Adventure, Comedy, Superhero',
  },
];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('My top 10 favorite movies!');
});
//get request for all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});
//shows successful get request for directors
app.get('/movies/director', (req, res) => {
  res.send('Successful GET of movie director.');
});
//shows successful get request for genres
app.get('/movies/genres', (req, res) => {
  res.send('Successful GET of movie genres.');
});
//shows successful get request for movie titles
app.get('/movies/title', (req, res) => {
  res.send('Successful GET of movie title.');
});
app.get('/users', (req, res) => {
  res.json(users);
});
//shows successful get request for list of users
app.get('/users/username', (req, res) => {
  res.send('Successful GET request for users.');
});
// get request for movie title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((topMovie) => {
    return topMovie.title === req.params.title
  }));
});
// get request for movie director
app.get('/movies/:director', (req, res) => {
  res.json(movies.find((topMovie) => {
    return topMovie.director === req.params.director
  }));
});
// get request for movie genre
app.get('/movies/:genres', (req, res) => {
  res.json(movies.find((topMovie) => {
    return topMovie.genres === req.params.genres
  }));
});
// update a users username
app.put('/users/:username/:newUsername', (req, res) => {
  let user = users.find((user) => {
    return user.username === req.params.username
  });
  if (user) {
    user.username = req.params.newUsername;
    res.status(201).send('Username was changed to ' + req.params.newUsername);
  } else {
    res.status(404).send(req.params.username + ' was not changed.');
  }
  });
// allows users to add to the favorite list
app.post('/users/:username/:favoriteList', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {{
    const message = 'Missing title in request body';
    res.status(400).send(message)};
  if (!newMovie.director){
    const message2 = 'Missing director in request body';
    res.status(400).send(message2)};
  if (!newMovie.genre){
    const message3 = 'Missing genre in request body';
    res.status(400).send(message3)};
  } else {
    res.send('Movie had been added to favorites list.');
    newMovie.id = uuid.v4();
    movies.push(newMovie);
    res.status(201).send(newMovie);
  };
});
// Deletes a movie from our list by title
app.delete('/movies/:title', (req, res) => {
  let movie = movies.find((movie) => {
    return movie.title === req.params.title
  });

  if (movie) {
    res.send('Movie has been removed form favorites list.')
    movies = movies.filter((obj) => {
      return obj.title !== req.params.title
    });
  }
});
app.delete('/users/:email', (req, res) => {
  let email = users.find((email) => {
    return email.email === req.params.email
  });

  if (email) {
    res.send('Email has been removed.')
    email = users.filter((obj) => {
      return obj.email !== req.params.email
    });
  }
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
