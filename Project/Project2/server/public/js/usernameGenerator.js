//Generate a username and save it in localStorage
const USERNAME_DATA = 'username-data-for-the-share-a-recipe-app'

$('#generateUsername_button').on(`click`, generateUsername);
let usernameData;

function generateUsername() {
  console.log(language);
  //get the username JSONs from the server
  if (language === 'fr') {
    $.get('/usernameOptionsFrench', function(data, status) {
      usernameData = data;
    })
  }
  else if (language === 'en') {
    $.get('/usernameOptions', function(data, status) {
      usernameData = data;
    })
  }

  //roulette effect to select the username
  //Speed and times can be set here
  const timesRunFast = 20;
  const timesRunMedium = 10;
  const timesRunSlow = 5;

  const fastSpeed = 35;
  const mediumSpeed = 100;
  const slowSpeed = 200;

  let username;
  //FastSpeed
  let timesRun = 0;
  let intervalFast = setInterval(function(){
      timesRun += 1;
      if(timesRun === timesRunFast){
          clearInterval(intervalFast);
          //MediumSpeed
          timesRun = 0;
          let intervalMedium = setInterval(function(){
              timesRun += 1;
              if(timesRun === timesRunMedium){
                  clearInterval(intervalMedium);
                  //SlowSpeed
                  timesRun = 0;
                  intervalSlow = setInterval(function(){
                      timesRun += 1;
                      username = randomizeUsername()
                      $('#generated_username').html(username);
                      if(timesRun === timesRunSlow){
                          clearInterval(intervalSlow);
                          //Save to the LocatStorage
                          userData = {
                            username: username
                          }
                          saveLocal(userData, USERNAME_DATA);
                      }
                  }, slowSpeed);
              }
              username = randomizeUsername()
              $('#generated_username').html(username);
          }, mediumSpeed);
      }
      username = randomizeUsername()
      $('#generated_username').html(username);
  }, fastSpeed);
}

function randomizeUsername() {
  let verb;
  let ending = '';
  let r = random();
  //a chance to use either wine descriptions or food verbs for the username
  if (r > 0.5) {
    verb = toCamelCase(
      capitalizeFirstLetter(
        random(usernameData[1].verbs)
      )
    );
  }
  else {
    verb = toCamelCase(
      capitalizeFirstLetter(
        random(usernameData[2].wine_descriptions)
      )
    );
  }

  //a chance to add a random ending to the username
  if (r > 0.2) {
    let r2 = random();
    if (r > 0.5) {
      ending = random(usernameData[3].regular);
    }
    else {
      //emojis
      ending = String.fromCodePoint(random(usernameData[3].emojis)[1]);
    }
  }

  //chose a random food item
  let menuItem = toCamelCase(
    random(usernameData[0].menuItems)
  );

  let username = menuItem + verb + ending;
  return username;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toCamelCase(string) {
  let result = "";
  //convert to Words
  let regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g; //regex that extrudes words
  let words = string.match(regex);

  for (let i = 0; i < words.length; i++) {
    let wordTemp = words[i];
    wordTemp = capitalizeFirstLetter(wordTemp);
    result += wordTemp
  }

  return result;
}
