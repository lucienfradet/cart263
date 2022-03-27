/**
Recipe Book Prototype
Lucien Cusson-Fradet
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
$('#submit_button').on(`click`, submitRecipe);
$('#analyse_button').on(`click`, analyseThis);

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
    }); //this works but should really be something else! get vs. post? (it's using a get function to actually post...)
  }
}

function analyseThis() {
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
