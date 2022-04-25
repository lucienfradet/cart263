let timeSlider = $("#time-slider");
let inputQuery = document.querySelector('input');
let displayTime = $("#time");
let displayDate = $("#date");
let dateSwitcher = false;

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
  inputQuery.addEventListener('input', function() {
    let value = parseInt(inputQuery.value);
    displayTime.html(
      convertTimeStampHourMinutes(value)
    );

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

function changeDateNumber(timeStamp, direction) {

}

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
  console.log(recipe);
}
