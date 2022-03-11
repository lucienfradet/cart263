/**
La vis - Raymond Lévesque
Lucien Cusson-Fradet
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

function addSpan(array) {
  $(`.poem`).each(function() { //for every element of the poem class
    let textArray = $(this).text().split(" ");

    $.each(textArray, function(j) { //for every "word" of the p text (index = j)
      for (let i = 0; i < array.length; i++) { //compare the textArray to everyElement in the words array
        let wordID = `word` + i; //give everyElement a different id

        if (textArray[j].match(array[i])) { //replace if it matches
          textArray[j] = `<span class="secret-word" id="${wordID}">` + textArray[j] + `</span>`;
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
    let wordArray = [];
    $(`.secret-word`).each(function() {
      if ($(this).attr(`id`) === `word${i}`) {
        wordArray.push($(this));
      }
    });
    if (wordArray.length > 1) {
      let word = shuffle(wordArray).shift() //remove the first element of the shuffled array
      for (let j = 0; j < wordArray.length; j++) {
        wordArray[j].removeAttr('id');
        wordArray[j].removeAttr('class');
      }
    }
  }
}

function replaceLetters() {

}

//Extrude words from the poem with REGEX
const NUM_SECRET_WORDS = 2;
let rightAnswerCounter = 0;
let secretWords = []; //arrays containing the word answers
let blankWords = []; //I don't think I really need that array but here it is lol
const blankValue = "?";

let poemText = $(".poem").text() //get the text in the poem class
let wordRegex = /\b[A-zÀ-ú]{4,}\b/g //any words equal or larger than 4 letters
let words = shuffle(poemText.match(wordRegex)); //shuffle the array
words.splice(NUM_SECRET_WORDS); //keep only the first 5 elements
addSpan(words);

$(`.secret-word`).each(function() {
  $(this).attr(`contentEditable`, `true`); //make contentEditable

  let letters = $(this).text().toLowerCase().split("");
  let blankLetters = letters.slice();
  secretWords.push(letters) //save the letters

  const NUM_HINT_LETTERS = Math.ceil(blankLetters.length * 50/100); //ceil.50% of the words should stay visible as hints
  let hintPlacement = []; //array that matches the letters
  $.each(blankLetters, function(i) {
    let hint;
    if (i < NUM_HINT_LETTERS - 1) {
      hint = true; //the first NUM_HINT_LETTERS of elements are true and wont be changed to a blank space
    }
    else {
      hint = false;
    }
    hintPlacement.push(hint);
  });
  shuffle(hintPlacement); //give the hints random positions

  $.each(blankLetters, function(i) {
    if (!hintPlacement[i]) {
      blankLetters[i] = blankValue;
    }
  });

  blankWords.push(blankLetters);
  let output = blankLetters.join(""); //bring everything back together
  $(this).html(output); //and inside html
});

setInterval(checkInputs, 600);

function checkInputs() {
  $(`.secret-word`).each(function(i) {
    let numBlank = 0;
    let letters = $(this).text().split("");
    $.each(letters, function(j) {
      if (letters[j] === blankValue) {
        numBlank++;
      }
    });

    if (numBlank === 0) {
      $(this).css(`color`, `red`);
    }

    if ($(this).text() === secretWords[i].join("") && $(this).attr(`contentEditable`)) {
      rightAnswerCounter++;
      $(this).removeAttr(`contentEditable`);
      $(this).css(`color`, `green`);
    }
    if (rightAnswerCounter === secretWords.length) {
      $(this).css(`color`, `black`);
    }
  });
}
