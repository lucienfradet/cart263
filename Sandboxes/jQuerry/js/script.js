/**
Testing jQuerry library
Lucien Cusson-Fradet
*/

"use strict";

// let $mainHeading = $(`#main-heading`);
// $mainHeading.css(`color`, `#339966`);

//or!

$(`#main-heading`).css(`color`, `#339966`);

//usual way of going through multiple class elements
// let classHeader = document.getElementsByClassName(`header`);
// for (let i = 0; i < classHeader.length; i++) {
//   classHeader[i].style.color = 'cyan';
// }

//NOW!
$(`.header`).css(`color`, `red`);

//can change multiple in an Object
$(`.header`).css({
  "color": `blue`,
  "background-color": `orange`,
  "font-size": `5rem`
});

let $span = $(`#example-span`)
let spanText = $span.text();
let reversedSpanText = spanText.split(``).reverse().join(``); //reverses the array
$(`#example-span`).text(reversedSpanText);

//two ways to make the text bold, with css and html
//$span.css(`font-weight`, `bolder`);

let spanHTML = $(`#example-span`).html(); //this could be inside the ${} like so: $(`#example-span`).html(`<strong>${$(`#example-span`).html();}</strong>`);
$(`#example-span`).html(`<strong>${spanHTML}</strong>`);

//attributes
$(`#main-heading`).attr(`contentEditable`, `true`);

let $link = $(`#thicc-link`);
if ($link.attr(`href`) === `https://thi.cc`) {
  $link.text(`BIGBUTT`);
}

//creating elements
let $p = $(`<p>Fresh, fresh paragraph!</p>`);
$(`#second-section`).append($p); //adds inside (at the end)

let $otherP = $(`<p>Inserted paragraph!</p>`);
$(`h2`).after($otherP); //add after (THERE IS ALSO BEFORE! lol)

//removing elements
// $(`#main-heading`).remove();
// $(`.header`).remove();

//EVENTS!!! these use the regular DOM events
$(`#main-heading`).on(`click`, function(event) { //"event" is needed and has alot of properties and such look into in in a console.log(event)
  $(this).append(`<p>This is added on EVERY click</p>`);
});
$(`#main-heading`).one(`click`, function(event) {
  $(this).append(`<p>This is added on the FIRST click</p>`);
});

$(`p`).click(function(event) { //this is equivalent but can't use .on and .one
  $(this).remove();
});

//remove event listeners
let colorChange; //giving the function a name then you can specify which event function you want to remove instead of all the click events
$(`.header`).on(`click`, colorChange = function(event) {
  $(this).css(`color`, `red`);
  $(`.header`).off(`click`, colorChange); //removes the EventListener after the first click
});

//INPUTS!!!
$(`#example-button`).on(`click`, function(event) {
  let input = $(`#example-text-input`).val(); //.val instead of value in regular JS
  $(`#third-section`).after(`<p>${input}</p>`);
});
