var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

var app = express();

app.use(cors());

// configure app to use ejs as view engine
app.set('view engine', 'ejs');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// configure body-parser
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var SCORES = [
  {
    id: 1,
    name: 'Eugene Oei',
    score: 99
  },
  {
    id: 2,
    name: 'Nick Ang',
    score: 99
  }
];

// CREATE - new entry form
app.get('/entries/new', function (req, res) {
  res.render('entry_new');
});

// CREATE - show new entry
app.post('/entries', function (req, res) {
  var newId = SCORES.length + 1;
  var newEntry = {
    id: newId,
    name: req.body.name,
    score: req.body.score
  };
  SCORES.push(newEntry);

  res.redirect('/entries/' + newId);
});

// READ scores
app.get('/entries', function (req, res) {
  res.json(SCORES);
});

// READ score of one entry
app.get('/entries/:id', function (req, res) {
  var id = req.params.id;
  var result = getEntry(id);
  res.json(result);
});

// UPDATE - edit form, pre-populated with data
app.get('/entries/:id/edit', function (req, res) {
  var id = parseInt(req.params.id); // must parseInt!
  var result = getEntry(id);
  res.render('entry_edit', {data: result});
});

// UPDATE - accept info from form, show updated entry
app.put('/entries/:id', function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < SCORES.length; i++) {
    if (SCORES[i].id === parseInt(id)) {
      SCORES[i].name = req.body.name;
      SCORES[i].score = req.body.score;
    }
  }
  res.redirect('/entries');
});

function getEntry (id) {
  var result = {};
  for (var i = 0; i < SCORES.length; i++) {
    if (SCORES[i].id === parseInt(id)) {
      result = SCORES[i];
    }
  }
  return result;
}

console.log('You\'re surfing the big waves of http://localhost:3000');
app.listen(3000);
