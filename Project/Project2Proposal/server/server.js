'use strict';
/*
This is a server test
I was able to run the static website located in "public" folder using Node.js and express
It was also possible to post and get data to the Cloudant database.
I felt like I was almost there, but I can't seem to run the server on the internet
*/

//reference to node.js modules
let fs = require('fs');
let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let url = require('url');
let bodyParser = require('body-parser')


// Load the Cloudant library.
let Cloudant = require('@cloudant/cloudant');

// Get account details from environment variables
let cloudantUrl = "https://755b6d2e-a89a-43c4-ad5e-3c79ee9746ea-bluemix.cloudantnosqldb.appdomain.cloud/recipedb";
let cloudantUsername = "apikey-v2-2tveshkio0wur6t5dclgze9lax5qd3q07xrx7b9mkxco";
let cloudantPassword = "7cd8d5146af3db26a53775756baee9fa";

// Initialize the library with url and credentials.
let cloudant = Cloudant({ url: cloudantUrl, username: cloudantUsername, password: cloudantPassword });

//loading the data
let data = fs.readFileSync('data/recipe.json'); //Sync (synchronus) means the program waits for the readFile to complete before continuing
let recipes = JSON.parse(data);


//parse application from https://www.npmjs.com/package/body-parser
//This alows to access the body from post that are sent to the server using ex: request.body
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

/*
--GET AND POST PATHS--
*/

//playing around with JSON files stored locally in the Node.js server
//those "gets" post new recipes to the JSON data file
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

  async function asyncCall() {
  return cloudant.use('recipedb').insert({ happy: true }, 'rabbit'); //this is a test and it works to upload JSON data to the Cloudant database
  }

  asyncCall().then((data) => {
    console.log(data); // { ok: true, id: 'rabbit', ...
  }).catch((err) => {
    console.log(err);
  });
}

//not in use
app.get('/recipes', sendAll);

function sendAll(request, response) {
  response.send(recipes);
}

//experimenting with simple search calls
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

//trying body parser with a post
app.post('/analyse', analyseData);

function analyseData(request, response) {
  console.log(`New data submited for analysis:`); console.log(request.body); //works because of bodyParser!
  let reply = {
    msg: 'thank you.'
  }
  response.send(reply);
}

//This section of the code is in pair with "client-app/client.js" and is trying to host the server on Heroku
//testing code following a tutorial by Codeboard Club https://www.youtube.com/watch?v=Nyn-CEgy-B8
let clientResponseRef;
app.get('/*', generalGet);
function generalGet(request, response) {
  let pathname = url.parse(request.url).pathname;

  let req = {
    pathname: pathname,
    method: "get",
    parmas: request.query
  }

  io.emit("page-request", req);
  clientResponseRef = response;
}

app.post('/*', generalPost);
function generalPost(request, response) {
  let pathname = url.parse(request.url).pathname;

  let req = {
    pathname: pathname,
    method: "post",
    parmas: request.body
  }

  io.emit("page-request", req);
  clientResponseRef = response;
}

io.on('connection', manageConnections);
function manageConnections(socket) {
  console.log('a node connected');
  socket.on("page-response", pageResponse);
  function pageResponse(response) {
    clientResponseRef.send(response);
  }
}

//Server ports
let server_port = process.env.YOUR_PORT || process.env.PORT || 4000;
http.listen(server_port, function() {
  console.log(`listening on *: ${server_port}`);
})
//END OF TUTORIAL CODE

//Starting server locally
console.log("server is starting");
let server = app.listen(3000, listening);

function listening() {
  console.log("listening. . .");
}

//running the website
app.use(express.static('public'));
