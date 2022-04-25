/**
Recipe Book Prototype
Lucien Cusson-Fradet

The client based website was a test to upload and get data from a JSON file
I want the data to be uploaded on the Cloudant database but I don't think it can be done (or would be wise) with a client website
Cloudant posts and gets are done through a Node.js module that can't really be accessed by the client.
*/

"use strict";
let hello = "HELLO!?!? YA TU KEK CHOSE QUI S'PASSE!?!?"

let recipe;

//hide the loaders
$("#map-loader").hide();

displayTopControls();

function setup() {
  noCanvas();
}

function draw() {

}

//Convert TimeStamp to ISO-8601 string
function convertTimeStamp(stamp) {
  let date = new Date(stamp);
  return  "" + date.getFullYear() +
          "-" + (date.getMonth() + 1) +
          "-" + date.getDate() +
          "T" + date.getHours() +
          ":" + date.getMinutes() +
          ":" + date.getSeconds() +
          "." + date.getMilliseconds() + "Z";
}

function convertTimeStampHourMinutes(stamp) {
  let date = new Date(stamp);
  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return  "" + date.getHours() +
          ":" + minutes;
}

function convertTimeStampHour(stamp) {
  let date = new Date(stamp);
  return  '' + date.getHours();
}

function convertTimeStampMonth(stamp) {
  let date = new Date(stamp);
  let month =  date.getMonth();

  const monthNamesEnglish = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  const monthNamesFrench = ["janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];

  if (language === 'en') {
    return monthNamesEnglish[month]
  }
  else if (language === 'fr') {
    return monthNamesFrench[month]
  }

}

function convertTimeStampDate(stamp) {
  let date = new Date(stamp);
  return  "" + date.getDate();
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

//https://attacomsian.com/blog/javascript-detect-mobile-device#:~:text=To%20detect%20if%20the%20user,and%20platform%20of%20the%20browser.
function deviceTypeDetect() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};
console.log(deviceTypeDetect());

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
