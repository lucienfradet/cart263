//Function dealing with the user interface

let timeSlider = $("#time-slider");
let rangeInputQuery = document.querySelector('#time-slider');
let displayTime = $("#time");
let displayDate = $("#date");
let dateSwitcher = false; //switcher for the midnight day switch

//sets up the date values and the controls for date "queries"
function displayTopControls() {
  const dateStamp = new Date().getTime();

  //Find the timestamp at midnight to deal with the date switch
  const dateArray = convertTimeStamp(dateStamp).split('T');
  const dateZero = new Date(
    dateArray[0].toString()
  ).getTime();

  displayTime.html(convertTimeStampHourMinutes(dateStamp));
  timeSlider.prop({
    'max': dateStamp,
    'min': dateStamp - 24*60*60*1000
  });
  timeSlider.val(dateStamp);
  displayDate.html(
    convertTimeStampDate(dateStamp) + ' ' + convertTimeStampMonth(dateStamp)
  )

  //Create event listenner for the slider
  rangeInputQuery.addEventListener('input', function() {
    let value = parseInt(rangeInputQuery.value);
    displayTime.html(
      convertTimeStampHourMinutes(value)
    );

    //Displays the data contained in recipe variable according to the slider selected time.
    //(Time stamp appear on the map up to 2 hours after their creation)
    displayDataOnMap(value);

    //Change the date number if user passes midnight
    if (value < dateZero && !dateSwitcher) {
      let date = displayDate.text();
      let dateNumber = parseInt(date.split(' ')[0]);
      displayDate.html(
        (dateNumber - 1) + ' ' + convertTimeStampMonth(value)
      )
      dateSwitcher = true;
    }
    else if (value > dateZero && dateSwitcher) {
      let date = displayDate.text();
      let dateNumber = parseInt(date.split(' ')[0]);
      displayDate.html(
        (dateNumber + 1) + ' ' + convertTimeStampMonth(value)
      )
      dateSwitcher = false;
    }
  });
}

//add or remove 24 hours to the range slider and change the date display
//Also, loads data for the new 24 hour range and display it if needed
async function arrowClick(direction) {
  let date = parseInt(displayDate.text().split(' ')[0]);
  let sliderMin = parseInt(timeSlider[0].attributes['2'].nodeValue);;
  let sliderMax = parseInt(timeSlider[0].attributes['3'].nodeValue);
  let sliderValue = parseInt(timeSlider.val());

  let dayLength = 24*60*60*1000;
  if (direction === 'left') {
    date -= 1;
    sliderMin -= dayLength;
    sliderMax -= dayLength;
    sliderValue -= dayLength;
  } else if (direction === 'right') {
    date += 1;
    sliderMin += dayLength;
    sliderMax += dayLength;
    sliderValue += dayLength;
  }

  timeSlider.prop({
    'max': sliderMax,
    'min': sliderMin
  });
  timeSlider.val(sliderValue);
  displayDate.html(
    convertTimeStampDate(sliderValue) + ' ' + convertTimeStampMonth(sliderValue)
  )

  await requestData(sliderMax, dayLength);
  displayDataOnMap(sliderValue);
}

//--Recipe input functions--

//hide all the popup elements on startup
$("#geoloc-popup").hide();
$("#username-popup").hide();
$("#title-popup").hide();
$("#description-popup").hide();
$("#recipe-popup").hide();

//There is a Next and Back button for every popup window.
function addRecipeStart() {
  geoLocalize(); //initiate geolocation
  if (popup !== undefined) {
    popup.remove()
  };
  $("#geoloc-popup").show();
}

function geolocNext() {
  $("#geoloc-popup").hide();
  $("#username-popup").show();

  if (!usernameFixed) {
    usernameFixed = getLocal(USERNAME_DATA).username;
    if (usernameFixed !== undefined) {
      $('#username-display').html(usernameFixed);
    }
  }
}

function geolocBack() {
  $("#geoloc-popup").hide();
}

function usernameNext() {
  $("#username-popup").hide();
  $("#title-popup").show();
}

function usernameBack() {
  $("#username-popup").hide();
  $("#geoloc-popup").show();
}

function titleNext() {
  if ($('#name-input').val() === '') {
    $('#name-input').effect("shake", { times:3 }, 300);
  }
  else {
    $("#title-popup").hide();
    $("#description-popup").show();
  }
}

function titleBack() {
  $("#title-popup").hide();
  $("#username-popup").show();
}

function descriptionNext() {
  if ($('#description-text').val() === '') {
    $('#description-text').effect("shake", { times:3 }, 300);
  }
  else {
    $("#description-popup").hide();
    $("#recipe-popup").show();
  }
}

function descriptionBack() {
  $("#description-popup").hide();
  $("#title-popup").show();
}

async function recipeNext() {
  await sendUserData() //publish data from the user!
  resetMap();
}

//dowload and refresh the data from the database including the one from the user
async function resetMap() {
  await requestData(parseInt(timeSlider[0].attributes['3'].nodeValue), 24*60*60*1000);
  //timeSliderMaxValue is the exact time the user got on the site
  //Because it doesn't get refreshed I use the value for posting
  //Without it the newly entered userData would be stuck in an non existing future on the website's scope lol
  displayDataOnMap(
    parseInt(
      rangeInputQuery.value
    )
  );
  $("#recipe-popup").hide();
}

function recipeBack() {
  $("#recipe-popup").hide();
  $("#description-popup").show();
}
