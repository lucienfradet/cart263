//request all data from a timeStamp and timeStamp - range
async function requestData(timeStamp, range) {
  $("#map-loader").show();
  const minTimeStamp = timeStamp - range;
  let params = {
    min: minTimeStamp,
    max: timeStamp
  };

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
    console.log(result.docs);
    return; //GET OUT
  }
  catch (error) {
    console.log(error);
  }
}
