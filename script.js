"use strict";

//Jquery

$(document).ready(function () {
  const setMarginTop = () => {
    let currentHeight = $(window).height(); // Grab the current height of the screen
    let elementCenter = $(".element-center"); // Grab the element
    let currentMargin = currentHeight / 2.2;
    //apply the margin-top element
    elementCenter.css("margin-top", currentMargin);
    return;
  };
  setMarginTop(); // call the function when the open the app
  $(window).resize(() => {
    setMarginTop(); // call the function when the page is resized.
  });
});

///////////////////////////////////////////////////////////////////
//Javascript

//set classes and ids
const api = {
  key: "f87193c8c1fceec76b7fc9727dfdd1da",
  base: "http://api.openweathermap.org/data/2.5/",
  unitsMetric: "metric",
  unitsImperial: "imperial",
};
const input = document.getElementById("input");
const inputSection = document.querySelector(".input-section");
const localCurrentDate = document.getElementById("localCurrentDate");
const contentContainer1 = document.getElementById("content-container1");
const contentContainer2 = document.getElementById("content-container2");
const contentContainer3 = document.getElementById("content-container3");
const contentContainerHourlyTitle = document.getElementById(
  "content-container-title1"
);
const contentContainerWeeklyTitle = document.getElementById(
  "content-container-title2"
);
const videoChange = document.getElementById("video-change");
const form = document.querySelector(".form");
const am = "am";
const pm = "pm";

//store data to the global variable
let allData = [];

///////////////////////////////////////////////////////////////////

//get current result from Web API
function getCurrentResult(query) {
  fetch(
    `${api.base}weather?q=${query}&units=${api.unitsMetric}&id=524901&appid=${api.key}`
  )
    .then((res) => {
      if (!res.ok) {
        //console.error("error");
        alert("Invalid city name. Please search again.");
      }
      res.json().then((data) => {
        allData = data;
        console.log(data);
        //variable for changing the display of °F on the current content
        const displayCandF = document.getElementById("#displayCandF");

        //display current content
        displayCurrentContent(data);
        //change background
        changeBackground(data);
        // get Hourly result from Web API
        getHourlyResult(data);
        //get weekly result from Web API
        getWeeklyResult(data);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  //get current result from Web API
  getCurrentResult(input.value);

  //add input anime
  inputSection.classList.add("input-anime");

  //Clear the content
  contentContainer1.innerHTML = "";
  contentContainer2.innerHTML = "";
  contentContainer3.innerHTML = "";
  localCurrentDate.innerHTML = "";

  //Clear the input
  input.value = "";

  //Clear the title
  contentContainerHourlyTitle.innerHTML = "";
  contentContainerWeeklyTitle.innerHTML = "";
});

//display current content
function displayCurrentContent(data) {
  //converts country code to country name
  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  let currentWeatherContent = `<div id="content">
          <p>${data.name}, ${regionNames.of(data.sys.country)}</p>
          <span id="current-temp">${Math.round(
            data.main.temp
          )}<span id="displayCandF">°C</span></span>
          <div><button class="button" type="button" id="celsius">°C</button> / <button class="button" type="button" id="fahrenheit">°F</button></div>
          <div class="content">
            <p>${data.weather[0].main}</p>
            <p>feels like ${Math.round(data.main.feels_like)}°</p>
          </div>
          <p class="displayDate"></p>
        </div>`;
  contentContainer1.insertAdjacentHTML("beforeend", currentWeatherContent);

  //Change celsius to fahrenheitTemp
  const celsius = document.getElementById("celsius");
  const fahrenheit = document.getElementById("fahrenheit");

  function changeToF() {
    fahrenheit.addEventListener("click", () => {
      fetch(
        `${api.base}weather?q=${data.name}&units=${api.unitsImperial}&id=524901&appid=${api.key}`
      )
        .then((res) => {
          if (!res.ok) {
            console.error("error");
            //alert("Invalid city name. Please search again.");
          }
          res.json().then((data) => {
            allData = data;
            //console.log(data);

            contentContainer1.innerHTML = "";
            contentContainer2.innerHTML = "";
            contentContainer3.innerHTML = "";

            // display current content
            displayCurrentContent(data);
            //innerHTML for changing the display of °F on the current content
            displayCandF.innerHTML = "°F";
            // get Hourly result from Web API
            getHourlyResult2(data);
            //get weekly result from Web API
            getWeeklyResult2(data);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
  changeToF();

  //Change fahrenheit to celsiusTemp
  function changeToC() {
    celsius.addEventListener("click", () => {
      fetch(
        `${api.base}weather?q=${data.name}&units=${api.unitsMetric}&id=524901&appid=${api.key}`
      )
        .then((res) => {
          if (!res.ok) {
            console.error("error");
            //alert("Invalid city name. Please search again.");
          }
          res.json().then((data) => {
            allData = data;
            //console.log(data);

            contentContainer1.innerHTML = "";
            contentContainer2.innerHTML = "";
            contentContainer3.innerHTML = "";

            // display current content
            displayCurrentContent(data);
            // get Hourly result from Web API
            getHourlyResult(data);
            //get weekly result from Web API
            getWeeklyResult(data);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
  changeToC();
}

//change background
function changeBackground(data) {
  if (data.weather[0].main === "Clouds") {
    videoChange.src = "bg-video/cloudy.mp4";
  }
  if (data.weather[0].main === "Clear") {
    videoChange.src = "bg-video/sunny.mp4";
  }
  if (data.weather[0].main === "Rain") {
    videoChange.src = "bg-video/rainy.mp4";
  }
}

//get local current time
function localDate(d) {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: d.timezone,
  });
}

function localTime(t) {
  return new Date().toLocaleString("en-US", {
    timeZone: t.timezone,
    timeStyle: "short",
    hourCycle: "h24",
  });
}

///////////////////////////////////////////////////////////////////

// get Hourly result from Web API
function getHourlyResult(data) {
  fetch(
    `${api.base}onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=${api.unitsMetric}&exclude=curret,minutely,daily,alerts&appid=${api.key}`
  )
    .then((res) => {
      if (!res.ok) {
        console.error("error");
        //alert("Invalid city name. Please search again.");
      }
      res.json().then((dataHour) => {
        console.log(dataHour);
        //display hourly content
        displayHourlyContent(dataHour);
        //display local time and Date
        let timeResult1 = localTime(dataHour).slice(0, 2);
        let timeResult2 = localTime(dataHour).slice(3);
        let timeResult3 =
          timeResult2[0] === "0" ? timeResult2.slice(1) : timeResult2;
        localCurrentDate.innerHTML = `Local time: ${
          timeResult1 <= 9
            ? timeResult1.slice(1, 2) + ":" + timeResult3 + am
            : timeResult1 >= 10 && timeResult1 <= 11
            ? timeResult1 + ":" + timeResult3 + am
            : timeResult1 === 12
            ? timeResult1 + ":" + timeResult3 + pm
            : timeResult1 >= 13 && timeResult1 <= 23
            ? timeResult1 - 12 + ":" + timeResult3 + pm
            : (timeResult1 = 12 + ":" + timeResult3 + am)
        }, ${localDate(dataHour)}`;
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

// get Hourly result from Web API(from celcius to fahrenheit)
function getHourlyResult2(data) {
  fetch(
    `${api.base}onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=${api.unitsImperial}&exclude=curret,minutely,daily,alerts&appid=${api.key}`
  )
    .then((res) => {
      if (!res.ok) {
        console.error("error");
        //alert("Invalid city name. Please search again.");
      }
      res.json().then((dataHour) => {
        console.log(dataHour);
        //display hourly content
        displayHourlyContent(dataHour);
        //display local time and Date
        let timeResult1 = localTime(dataHour).slice(0, 2);
        let timeResult2 = localTime(dataHour).slice(3);
        let timeResult3 =
          timeResult2[0] === "0" ? timeResult2.slice(1) : timeResult2;
        localCurrentDate.innerHTML = `Local time: ${
          timeResult1 <= 9
            ? timeResult1.slice(1, 2) + ":" + timeResult3 + am
            : timeResult1 >= 10 && timeResult1 <= 11
            ? timeResult1 + ":" + timeResult3 + am
            : timeResult1 === 12
            ? timeResult1 + ":" + timeResult3 + pm
            : timeResult1 >= 13 && timeResult1 <= 23
            ? timeResult1 - 12 + ":" + timeResult3 + pm
            : (timeResult1 = 12 + ":" + timeResult3 + am)
        }, ${localDate(dataHour)}`;
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

//display hourly content
//allData変数はなぜかここでは使える...。
function displayHourlyContent(dataHour) {
  const hourlyWeatherContentTitle = `
  <div>
    <h2 class="sub-title">Hourly Forecast - ${allData.name}</h2>
    </div>
    `;

  for (let i = 0; i < dataHour.hourly.length - 24; i++) {
    //get every hour
    function localTime2(t) {
      let nextHour = new Date();
      nextHour.setHours(nextHour.getHours() + i);
      return nextHour.toLocaleString("en-US", {
        timeZone: t.timezone,
        timeStyle: "short",
        hourCycle: "h24",
      });
    }
    let hourResult = +localTime2(dataHour).slice(0, 2);

    let iconCode = dataHour.hourly[i].weather[0].icon;
    const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    const hourlyWeatherContent = `
        <div>
        <div class="content">
          <p class="HourlyTemp">${Math.round(dataHour.hourly[i].temp)}°</p>
          <img src="${iconUrl}"class="weather-icons" />
          <p>${
            hourResult <= 11
              ? hourResult + am
              : hourResult === 12
              ? hourResult + pm
              : hourResult >= 13 && hourResult <= 23
              ? hourResult - 12 + pm
              : (hourResult = 12 + am)
          }</p>
        </div>
        </div>
      </div>`;

    contentContainer2.insertAdjacentHTML("beforeend", hourlyWeatherContent);
  }

  contentContainerHourlyTitle.innerHTML = hourlyWeatherContentTitle;
}

///////////////////////////////////////////////////////////////////

//get weekly result from Web API
function getWeeklyResult(data) {
  fetch(
    `${api.base}onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=${api.unitsMetric}&exclude=curret,minutely,hourly,alerts&appid=${api.key}`
  )
    .then((res) => {
      if (!res.ok) {
        console.error("error");
        //alert("Invalid city name. Please search again.");
      }
      res.json().then((dataWeek) => {
        console.log(dataWeek);
        //display weekly content
        displayWeeklyContent(dataWeek);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

// get weekly result from Web API(from celcius to fahrenheit)
function getWeeklyResult2(data) {
  fetch(
    `${api.base}onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=${api.unitsImperial}&exclude=curret,minutely,hourly,alerts&appid=${api.key}`
  )
    .then((res) => {
      if (!res.ok) {
        console.error("error");
        //alert("Invalid city name. Please search again.");
      }
      res.json().then((dataWeek) => {
        console.log(dataWeek);
        //display weekly content
        displayWeeklyContent(dataWeek);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

//allData変数はなぜかここでは使える...。
//display weekly content
function displayWeeklyContent(dataWeek) {
  const weeklyWeatherContentTitle = `
  <div>
    <h2 class="sub-title">Weekly Forecast - ${allData.name}</h2>
    </div>
    `;
  for (let i = 0; i < dataWeek.daily.length; i++) {
    //get local weekdays and weekend
    function localDate2(d) {
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + i);
      return tomorrow.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: d.timezone,
      });
    }

    let iconCode = dataWeek.daily[i].weather[0].icon;
    const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    const weeklyWeatherContent = `
        <div>
        <div class="content">
          <p>Max: ${Math.round(dataWeek.daily[i].temp.max)}°</p>
          <p>Min: ${Math.round(dataWeek.daily[i].temp.min)}°</p>
          <img src="${iconUrl}" class="weather-icons" />
          <p>${localDate2(dataWeek)}</p>
        </div>
        </div>
      </div>`;
    contentContainer3.insertAdjacentHTML("beforeend", weeklyWeatherContent);
  }
  contentContainerWeeklyTitle.innerHTML = weeklyWeatherContentTitle;
}

//TO Do List
//・change background and icons when the weather is other than sunny, cloudy, rainy
//・list of same name cities are displayed*
//・change background depands on nighttime and daytime
//・change layout
//・why its so heavy?
//・why icons looks are different from open weather
//・Update info every 2 mitutes
