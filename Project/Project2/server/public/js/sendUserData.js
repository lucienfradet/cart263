$('#submit_button').on(`click`, sendUserData);

async function sendUserData() { //async funtion to wait for the response
  let dateTest = new Date().getTime();
  let data = { //create the data
    date: dateTest.toString(), //not sure about the ISOString...
    location: userPosition,
    username: getLocal(USERNAME_DATA).username,
    recipeName: $('#recipeName_input').val(),
    recipeDescription: $('#recipeDescription_input').val(),
    recipe: $('#recipe_input').val()
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
