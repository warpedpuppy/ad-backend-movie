const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  methodOverride = require('method-override');

const app = express();

let topMovies = [
  {
    title: 'A Scanner Darkly',
    director: 'Richard Linklater',
    genre: 'Animation, Crime, Drama, Sci-fi',
  },
  {
    title: 'Blazing Saddles',
    director: 'Mel Brooks',
    genre: 'Comedy, Western',
  },{
    title: 'Fear and Loathing in Las Vegas',
    director: 'Terry Gilliam',
    genre: 'Adventure, Comedy, Drama',
  },{
    title: 'Jay and Silent Bob Strike Back',
    director: 'Kevin Smith',
    genre: 'Comedy',
  },{
    title: 'Jurassic Park',
    director: 'Steven Spielberg',
    genre: 'Action, Adventure, Sci-fi',
  },{
    title: 'Lord of the Rings Trilogy',
    director: 'Peter Jackson',
    genre: 'Action, Adventure, Drama, Fantasy',
  },{
    title: 'Star Trek III: The Search for Spock',
    director: 'Leonard Nimoy',
    genre: 'Action, Adventure, Sci-fi',
  },{
    title: 'Super Troopers',
    director: 'Jay Chandrasekhar',
    genre: 'Comedy, Crime, Mystery',
  },{
    title: 'Talladega Nights:  The Ballad of Ricky Bobby',
    director: 'Adam McKay',
    genre: 'Comedy, Sport',
  },{
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

app.get('/movies', (req, res) => {
  // res.send('Successful GET request for all endpoints.');
  res.json(topMovies);
});

app.get('/movies/director', (req, res) => {
  res.send('Successful GET of movie director.');
});

app.get('/movies/genres', (req, res) => {
  res.send('Successful GET of movie genres.');
});

app.get('/movies/title', (req, res) => {
  res.send('Successful GET of movie title.');
});

app.get('/users', (req, res) => {
  res.send('Successful GET request for all users.');
});

app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find((topMovie) => {
    return topMovie.title === req.params.title
  }));
});

app.get('/movies/:director', (req, res) => {
  res.json(topMovies.find((topMovie) => {
    return topMovie.director === req.params.director
  }));
});

app.get('/movies/:genres', (req, res) => {
  res.json(topMovies.find((topMovie) => {
    return topMovie.genres === req.params.genres
  }));
});

app.get('/users/:username', (req, res) => {
  res.json(users.find((user) => {
    return user.username === req.params.username
  }));
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
