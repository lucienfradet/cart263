$('#requestData_button').on(`click`, requestData);


//request all data from a timeStamp and timeStamp - range
async function requestData(timeStamp, range) {
  $("#map-loader").show();
  //this is for testing
  const timeStampTest = 1650835214960;
  const minTimeStamp = timeStamp - range;
  let params = {
    min: minTimeStamp, //this should normally be timeStamp!!!
    max: timeStamp
  };

  // let params = {
  //   min: timeStamp - range,
  //   max: timeStamp
  // };

  const url = '/get_data?' + new URLSearchParams(params).toString();

  try {
    const response = await fetch(url); //await the response

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json(); //await for the result
    $("#map-loader").hide();
    //array with the required data
    recipe = result.docs;
    return;
  }
  catch (error) {
    console.log(error);
  }
}
