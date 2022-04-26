//Prep and send userData to the server to be posted to the database

async function sendUserData() { //async funtion to wait for the response
  let date = parseInt(timeSlider[0].attributes['3'].nodeValue);
  let data = { //create the data
    date: date.toString(),
    location: userPosition,
    username: getLocal(USERNAME_DATA).username,
    recipeName: $('#name-input').val(),
    recipeDescription: $('#description-text').val(),
    recipe: $('#recette-text').val()
  };
  const options = {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  console.log('posting data to the server...')
  console.log(data);
  console.log(convertTimeStamp(parseInt(data.date)));

  //try catch to allow for errors to Console Logs
  try {
    const response = await fetch('/postUserData', options); //await the response

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json(); //await for the result
    console.log(result)

  }
  catch (error) {
    console.log(error);
  }
}
