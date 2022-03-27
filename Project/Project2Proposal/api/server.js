let recipes = {
  "bines": "doris",
  "poulet": "gevry",
  "boeuf": "kelv"
}

//Starting servr
console.log("server is starting");

let express = require("express");

let app = express();

let server = app.listen(3000, listening);

function listening() {
  console.log("listening. . .");
}

//running the website
app.use(express.static("website"));

app.get('/add/:recipe/:user?', addRecipe); //: is looking for a user entry and ? can only be added to the last one and means it's optional
app.get('/add/:recipe', addRecipe);

function addRecipe(request, response) {
  let data = request.params;
  let recipe = data.recipe;
  let user = data.user;
  if (!user) {
    user = 'unknown';
  }

  recipes[user] = recipe;

  let reply = {
    msg: "Thank you for you entry."
  }
  response.send(reply);
}

app.get('/recipes', sendAll);

function sendAll(request, response) {
  response.send(recipes);
}

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
