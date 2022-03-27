'use strict';

//loading node.js modules
let fs = require('fs');
let express = require("express");
let app = express();
let bodyParser = require('body-parser')

//loading the data
let data = fs.readFileSync('data/recipe.json'); //Sync (synchronus) means the program waits for the readFile to complete before continuing
let recipes = JSON.parse(data);

//Starting servr
console.log("server is starting");
let server = app.listen(3000, listening);

function listening() {
  console.log("listening. . .");
}

//running the website
app.use(express.static('public'));

//parse application from https://www.npmjs.com/package/body-parser
//This alows to access the body from post that are sent to the server using ex: request.body
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

/*
--GET AND POST PATHS--
*/

//get that actually posts a new recipe to the JSON data file
app.get('/add/:recipeName/:user?', addRecipe); //: is looking for a user entry and ? can only be added to the last one and means it's optional
app.get('/add/:recipeName', addRecipe);

function addRecipe(request, response) {
  let recipe = request.params;
  let recipeName = recipe.recipeName;
  let user = recipe.user;
  if (!user) {
    user = 'unknown';
  }

  recipes[recipeName] = user;
  let data = JSON.stringify(recipes);
  fs.writeFile('data/recipe.json', data, finished);

  function finished(err) {
    console.log('data updated!');
    let reply = {
      recipe: recipeName,
      user: user,
      status: "Successfully saved in Data!"
    }
    response.send(reply);
  }
}

//
app.get('/recipes', sendAll);

function sendAll(request, response) {
  response.send(recipes);
}

//
app.get('/search/:recipe?', searchRecipe);

function searchRecipe(request, response) {
  let recipe = request.params.recipe;
  let reply;
  if (recipes[recipe]) {
    reply = {
      status: "found",
      recipe: recipe,
      user: recipes[recipe]
    }
  } else {
    reply = {
      status: "not found",
      recipe: recipe
    }
  }
  response.send(reply);
}

app.post('/analyse', analyseData);

function analyseData(request, response) {
  console.log(`New data submited for analysis:`); console.log(request.body); //works because of bodyParser!
  let reply = {
    msg: 'thank you.'
  }
  response.send(reply);
}
