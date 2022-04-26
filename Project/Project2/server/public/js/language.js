//Language selection function using the MultiLanguage library
function languageSwitch() {
  if (language === 'fr') {
    setLanguage('en');
  } else if (language === 'en') {
    setLanguage('fr');
  }
}
