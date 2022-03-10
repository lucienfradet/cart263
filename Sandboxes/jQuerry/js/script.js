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

let span = $(`#example-span`)
let spanText = span.text();
let reversedSpanText = spanText.split(``).reverse().join(``); //reverses the array
$(`#example-span`).text(reversedSpanText);

//two ways to make the text bold, with css and html
//span.css(`font-weight`, `bolder`);

let spanHTML = $(`#example-span`).html(); //this could be inside the ${} like so: $(`#example-span`).html(`<strong>${$(`#example-span`).html();}</strong>`);
$(`#example-span`).html(`<strong>${spanHTML}</strong>`);
