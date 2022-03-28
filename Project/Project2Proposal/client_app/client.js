//code from the CodeboardClub tutorial https://www.youtube.com/watch?v=Nyn-CEgy-B8
//The idea was to host the server online using Heroku (https://dashboard.heroku.com/apps)
//and link the server to the website contained in the public folder
//The code doesn't work, might contain errors
//Truthfully, I'm not even sure on how to link the server.js to the "public" website

let socketServerUrl = "https://recipe-share-server.herokuapp.com/";
let hostToLive = "http://localhost";

let socketClient = require('socket.io-client');
let socket = socketClient(socketServerUrl);
const superagent = require('superagent');

socket.on('connect', function() {
  console.log("connected");
})

socket.on('disconnect', function() {
  console.log("connection lost");
})

socket.on('page-request', pageRequest);
function pageRequest(data) {
  let path = data.pathname;
  let method = data.method;
  let params = data.params;

  let localhostUrl = hostToLive + path; //constructing request url

  if (method === "get") {
    executeGet(localhostUrl, params);
  }
  else if (method === "post") {
    executePost(localhostUrl, params);
  }
}

function executeGet(url, params) {
  superagent.get(url)
  .query(params)
  .end(getReturns);

  function getReturns(err, response) {
    if (err) {
      return console.log(err);
    }
    socket.emit('page-response', response.text)
  }
}

function executePost(url, params) {
  superagent.post(url)
  .query(params)
  .end(getReturns);

  function getReturns(err, response) {
    if (err) {
      return console.log(err);
    }
    socket.emit('page-response', response.text)
  }
}
