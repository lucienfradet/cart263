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
let cloudant = Cloudant({ url: cloudantUrl, username: cloudantUsername, password: cloudantPassword }, function(err, cloudant, pong) {
  //callback that informs if the db connection was successfull
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
  console.log('Successfully initialized Cloudant:');
  console.log(pong); // {"couchdb":"Welcome","version": ...);
});
let db = cloudant.db.use('recipedb');

//loading usernameData
let usernameOptions = [];
let usernameOptionsFrench = [];

let usernameEndingsData = fs.readFileSync('data/username/usernameEndings.json');
let usernameEndings = JSON.parse(usernameEndingsData);

//English
let menuItemsData = fs.readFileSync('data/username/menuItems.json');
let menuItems = JSON.parse(menuItemsData);
let verbsData = fs.readFileSync('data/username/verbs.json');
let verbs = JSON.parse(verbsData);
let wineDescriptionsData = fs.readFileSync('data/username/wineDescriptions.json');
let wineDescriptions = JSON.parse(wineDescriptionsData);

usernameOptions = [menuItems, verbs, wineDescriptions, usernameEndings];

//French
let menuItemsFrenchData = fs.readFileSync('data/username/menuItemsFrench.json');
let menuItemsFrench = JSON.parse(menuItemsFrenchData);
let verbsFrenchData = fs.readFileSync('data/username/verbsFrench.json');
let verbsFrench = JSON.parse(verbsFrenchData);
let wineDescriptionsFrenchData = fs.readFileSync('data/username/wineDescriptionsFrench.json');
let wineDescriptionsFrench = JSON.parse(wineDescriptionsFrenchData);

usernameOptionsFrench = [menuItemsFrench, verbsFrench, wineDescriptionsFrench, usernameEndings];


//parse application from https://www.npmjs.com/package/body-parser
//This alows to access the body from post that are sent to the server using ex: request.body
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//running the website
app.use(express.static('public'));
//app.use(express.json()); //same as bodyParser but with express...

//start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// [END gae_flex_node_static_files]
module.exports = app;

/*
--GET AND POST PATHS--
*/

//Username requests
app.get('/usernameOptions', (request, response) => {
  response.send(usernameOptions);
  console.log('sending english username Data');
});

app.get('/usernameOptionsFrench', (request, response) => {
  response.send(usernameOptionsFrench);
  console.log('sending french username Data');
});

//Getting the user data in a date range
app.get('/get_data?', async (request, response) => {
  console.log('new getData request...')
  console.log("query: ", convertTimeStamp(parseInt(request.query.min)), convertTimeStamp(parseInt(request.query.max)));

  const query = {
    selector: {
      date: { "$gte": request.query.min , "$lte": request.query.max },
      //date: { "$gte": '0' , "$lte": '0' },
    },
    fields: ["date", "location", "username", "recipeName", "recipeDescription", "recipe"],
    limit: 150
  };

  const data = await db.find(query, (err, cursor) => {
    if (err) {
      console.log(`there was an error fetching the data:`);
      console.log(err);
      response.json(err);
    }
    else {
      //console.log(cursor);
      response.json(cursor);
    }
  });
});

//Posting UserData to cloudant db
app.post('/postUserData', (request, response) => {
  console.log('new post request...')
  console.log(request.body);

  async function asyncCall() {
    return cloudant.use('recipedb').insert(request.body);
  }

  asyncCall().then((data) => {
    console.log('data successfully uploaded to recipedb');
    console.log(data); // { ok: true, id: 'rabbit', ...
    response.json({
      status: 'upload to database successfull'
    });
  }).catch((err) => {
    console.log(err);
    response.json({
      status: 'upload to database FAILED'
    });
  });
});

//Convert TimeStamp to ISO-8601 string
function convertTimeStamp(stamp) {
  let date = new Date(stamp);
  return  "" + date.getFullYear() +
          "-" + (date.getMonth() + 1) +
          "-" + date.getDate() +
          "T" + date.getHours() +
          ":" + date.getMinutes() +
          ":" + date.getSeconds() +
          date.getMilliseconds() + "Z";
}
