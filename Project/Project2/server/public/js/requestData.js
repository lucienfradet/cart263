$('#requestData_button').on(`click`, requestData);


//request all data from a timeStamp and timeStamp - range
async function requestData(timeStamp, range) {

  //this is for testing
  const timeStampTest = 1650591254857;
  const minTimeStamp = timeStampTest - 1000*60*60;
  let params = {
    min: minTimeStamp,
    max: timeStampTest
  };

  // let params = {
  //   min: timeStamp - range,
  //   max: timeStamp
  // };

  const url = '/get_data?' + new URLSearchParams(params).toString();
  console.log(url);

  try {
    const response = await fetch(url); //await the response

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json(); //await for the result
    console.log(result)

    //array with the required data
    return result.docs
  }
  catch (error) {
    console.log(error);
  }
}
