/**
Recipe Book Prototype
Lucien Cusson-Fradet

The client based website was a test to upload and get data from a JSON file
I want the data to be uploaded on the Cloudant database but I don't think it can be done (or would be wise) with a client website
Cloudant posts and gets are done through a Node.js module that can't really be accessed by the client.
*/

"use strict";


function setup() {
  createCanvas(400, 400);
  background(51);
  loadJSON('/recipes', gotData);
}

function gotData(data) {
  console.log(data);

  let keys = Object.keys(data);
  for (let i in keys) {
    let recipe = keys[i];
    let user = data[recipe];

    let x = random(width);
    let y = random(height);
    fill(255);
    textSize(25);
    text(recipe, x, y);
  }
}

//test button events
$('#displayRecipe_button').on(`click`, displayRecipe);

//THIS SHIT IS DEAD was only a test, I'm rebuilding it in sendUserData.js!
function submitRecipe() {
  let recipe = $('#recipe_input').val();
  let user = $('#userName_input').val();
  console.log(recipe, user);

  if (recipe !== '') {
    if (user === '') {
      user = 'unknown';
    }
    loadJSON(`add/${recipe}/${user}`, function(data) {
      console.log(data);
    }); //this works locally but should really be something else! get vs. post? (it's using a get function to actually post...)
  }
}

function displayRecipe() {
  let txt = $('#text_input').val();

  let data = {
    text: txt
  }

  httpPost('/analyse', data, 'json', dataPosted, postErr);
}

function dataPosted(result) {
  console.log(result);
}

function postErr(err) {
  console.log(err);
}

//browser detect
function browserDetect(){
   let userAgent = navigator.userAgent;
   let browserName;

   if(userAgent.match(/chrome|chromium|crios/i)){
       browserName = "chrome";
     }else if(userAgent.match(/firefox|fxios/i)){
       browserName = "firefox";
     }  else if(userAgent.match(/safari/i)){
       browserName = "safari";
     }else if(userAgent.match(/opr\//i)){
       browserName = "opera";
     } else if(userAgent.match(/edg/i)){
       browserName = "edge";
     }else{
       browserName="No browser detection";
     }

    return browserName;
  }

  //Save and load from localStorage
  function saveLocal(data, name) {
    console.log(data);
    let dataString = JSON.stringify(data);
    localStorage.setItem(name, dataString);
  }

  function getLocal(dataName) {
    let data = JSON.parse(localStorage.getItem(dataName));
    if (data !== null) {
      console.log(data);
    }
    else {
      console.log('nothing in username storage!')
    }
    return data;
  }
