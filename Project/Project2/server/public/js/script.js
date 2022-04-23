/**
Recipe Book Prototype
Lucien Cusson-Fradet

The client based website was a test to upload and get data from a JSON file
I want the data to be uploaded on the Cloudant database but I don't think it can be done (or would be wise) with a client website
Cloudant posts and gets are done through a Node.js module that can't really be accessed by the client.
*/

"use strict";

//Convert TimeStamp to ISO-8601 string
function convertTimeStamp(stamp) {
  let date = new Date(stamp);
  return  "" + date.getFullYear() +
          "-" + (date.getMonth() + 1) +
          "-" + date.getDate() +
          "T" + date.getHours() +
          ":" + date.getMinutes() +
          ":" + date.getSeconds() +
          date.getMilliseconds() + "Z";
}

//browser detect
function browserDetect(){
   let userAgent = navigator.userAgent;
   let browserName;

   if(userAgent.match(/chrome|chromium|crios/i)){
       browserName = "chrome";
     }else if(userAgent.match(/firefox|fxios/i)){
       browserName = "firefox";
     }  else if(userAgent.match(/safari/i)){
       browserName = "safari";
     }else if(userAgent.match(/opr\//i)){
       browserName = "opera";
     } else if(userAgent.match(/edg/i)){
       browserName = "edge";
     }else{
       browserName="No browser detection";
     }

    return browserName;
  }

//Save and load from localStorage
function saveLocal(data, name) {
  console.log(data);
  let dataString = JSON.stringify(data);
  localStorage.setItem(name, dataString);
}

function getLocal(dataName) {
  let data = JSON.parse(localStorage.getItem(dataName));
  if (data !== null) {
    console.log(data);
  }
  else {
    console.log('nothing in username storage!')
  }
  return data;
}
