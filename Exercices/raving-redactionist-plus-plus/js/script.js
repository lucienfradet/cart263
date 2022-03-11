/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";
function shuffle(array) {
  let currentIndexTotal = array.length;
  let randomIndex;
  let placeHolder;

  while (currentIndexTotal !== 0) { //keep going until the all elements have been processed
    randomIndex = Math.floor(Math.random() * currentIndexTotal);
    currentIndexTotal--;

    //swap the elements in the array
    placeHolder = array[currentIndexTotal];
    array[currentIndexTotal] = array[randomIndex];
    array[randomIndex] = placeHolder;
  }

  return array;
}

//Extrude words from the poem with REGEX
const NUM_SECRET_WORDS = 5;

let poem = $(".poem").text() //get the text in the poem class
let wordRegex = /\b[A-zÀ-ú]{4,}\b/g //any words equal or larger than 4 letters
let words = shuffle(poem.match(wordRegex)); //shuffle the array
words.splice(NUM_SECRET_WORDS); //keep only the first 5 elements
addSpan(words);

function addSpan(array) {
  $(`.poem`).each(function() { //for every element of the poem class
    let textArray = $(this).text().split(" ");

    $.each(textArray, function(j) { //for every "word" of the p text (index = j)
      for (let i = 0; i < array.length; i++) { //compare the textArray to everyElement in the words array
        let wordClass = `secretWord` + i; //give everyElement a different id

        if (textArray[j].match(array[i])) { //replace if it matches
          textArray[j] = `<span class="${wordClass}">` + textArray[j] + `</span>`;
        }
      }
      if (textArray[j].match(`\n`)) { //place the <br> back
        textArray[j] = `<br>`;
      }
    });
    let output = textArray.join(" "); //bring everything back together and inside html
    $(this).html(output);
  });

  for (let i = 0; i < array.length; i++) { //select one random word of every class and give it a specific id
    let word = shuffle($(`.secretWord${i}`)).slice(0, 1);
    word.attr('id', `word${i}`);
  }
}
