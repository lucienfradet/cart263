//Language selection function using the MultiLanguage library

$("#french_button").on(`click`, () => {
  setLanguage('fr');
  //console.log(getLanguage());
});

$("#english_button").on(`click`, () => {
  setLanguage('en');
  //console.log(getLanguage());
});
