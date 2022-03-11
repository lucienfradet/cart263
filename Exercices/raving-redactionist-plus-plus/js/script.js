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
          textArray[j] = `<span class="secretWord" id="${wordID}">` + textArray[j] + `</span>`;
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
    $(`.secretWord`).each(function() {
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
const NUM_SECRET_WORDS = 5;
let secretWords = [];
let blankWords = [];

let poem = $(".poem").text() //get the text in the poem class
let wordRegex = /\b[A-zÀ-ú]{4,}\b/g //any words equal or larger than 4 letters
let words = shuffle(poem.match(wordRegex)); //shuffle the array
words.splice(NUM_SECRET_WORDS); //keep only the first 5 elements
addSpan(words);

$(`.secretWord`).each(function() {
  let letters = $(this).text().toLowerCase().split("");
  let blankLetters = letters.slice();
  secretWords.push(letters) //save the letters

  let validAnswer = false;
  let neededHintLetters = Math.round(blankLetters.length * 40/100);
  while(!validAnswer) {
    let numHintLetters = 0;
    $.each(blankLetters, function(i) {
      let index = Math.floor(Math.random() * blankLetters.length);

      if (index !== i) {
        blankLetters[i] = '?'
      }
      else {
        numHintLetters++;
      }
    });
    if (numHintLetters === neededHintLetters) {
      break;
    }
  }

  blankWords.push(blankLetters);
  let output = blankLetters.join(""); //bring everything back together
  $(this).html(output); //and inside html
});
