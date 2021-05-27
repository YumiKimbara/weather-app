"use strict";

//input form
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

//set global variables
const api = {
  key: apiKey.SECRET_API_KEY,
  base: "http://api.openweathermap.org/data/2.5/",
};
const metric = "metric";
const imperial = "imperial";
const input = document.getElementById("input");
const localCurrentDate = document.getElementById("localCurrentDate");
const containerForCurrentWeather = document.getElementById(
  "container-for-current-weather"
);
const containerForHourlyWeather = document.getElementById(
  "container-for-hourly-weather"
);
const containerForWeeklyWeather = document.getElementById(
  "container-for-weekly-weather"
);
const hourlyTitle = document.getElementById("hourlyTitle");
const weeklyTitle = document.getElementById("weeklyTitle");

//store data to the global variable
let allDataFromAPI = [];

//get current result from Web API
function getCurrentWeather(query, metric) {
  fetch(
    `${api.base}weather?q=${query}&units=${metric}&id=524901&appid=${api.key}`
  )
    .then((res) => {
      if (res.status === 404) {
        const modalContainer = document.querySelector(".modal-container");
        const modal = document.querySelector(".modal");
        const overlay = document.querySelector(".overlay");
        const closeBtn = document.querySelector(".close-btn");

        modalContainer.classList.remove("hidden");
        overlay.classList.remove("hidden");
        modal.innerHTML = "Invalid city name.<br />" + "Please search again.";

        closeBtn.addEventListener("click", () => {
          modalContainer.classList.add("hidden");
          overlay.classList.add("hidden");
        });

        overlay.addEventListener("click", () => {
          modalContainer.classList.add("hidden");
          overlay.classList.add("hidden");
        });
      }
      res.json().then((jsonData) => {
        allDataFromAPI = jsonData;
        //display current content
        renderCurrentWeather(jsonData);
        // get Hourly result from Web API
        getHourlyWeather(jsonData, metric);
        //get weekly result from Web API
        getWeeklyWeather(jsonData, metric);
      });
    })
    .catch((err) => {
      alert(`Something went wrong. ${err.message}`);
    });
}

const form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
  const inputSection = document.querySelector(".input-section");
  e.preventDefault();
  //get current result from Web API
  getCurrentWeather(input.value, metric);
  //add input anime
  inputSection.classList.add("input-anime");
  //Clear the content
  containerForCurrentWeather.innerHTML = "";
  containerForHourlyWeather.innerHTML = "";
  containerForWeeklyWeather.innerHTML = "";
  localCurrentDate.innerHTML = "";
  //Clear the input
  input.value = "";
  //Clear the title
  hourlyTitle.innerHTML = "";
  weeklyTitle.innerHTML = "";
});

const changeTemp = (units, data, temp) => {
  fetch(
    `${api.base}weather?q=${data.name}&units=${units}&id=524901&appid=${api.key}`
  )
    .then((res) => {
      if (!res.ok) {
        alert("Something went wrong!");
      }
      res.json().then((jsonData) => {
        allDataFromAPI = jsonData;

        containerForCurrentWeather.innerHTML = "";
        containerForHourlyWeather.innerHTML = "";
        containerForWeeklyWeather.innerHTML = "";

        // render current content
        renderCurrentWeather(jsonData);
        //innerHTML for changing the render of °F on the current content
        renderCandF.innerHTML = temp;
        // get Hourly result from Web API
        getHourlyWeather(jsonData, units);
        //get weekly result from Web API
        getWeeklyWeather(jsonData, units);
      });
    })
    .catch((err) => {
      alert(`Something went wrong. ${err.message}`);
    });
};

//render current content
function renderCurrentWeather(data) {
  //converts country code to country name
  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  let currentWeatherContent = `<div id="content">
          <p>${data.name}, ${regionNames.of(data.sys.country)}</p>
          <span id="current-temp">${Math.round(
            data.main.temp
          )}<span id="renderCandF">°C</span></span>
          <div><button class="button" type="button" id="celsius">°C</button><span> / </span><button class="button" type="button" id="fahrenheit">°F</button></div>
          <div class="content">
            <p>${data.weather[0].main}</p>
            <p>feels like ${Math.round(data.main.feels_like)}°</p>
          </div>
          <p class="displayDate"></p>
        </div>`;
  containerForCurrentWeather.insertAdjacentHTML(
    "beforeend",
    currentWeatherContent
  );

  const celsius = document.getElementById("celsius");
  const fahrenheit = document.getElementById("fahrenheit");

  //Change celsius to fahrenheitTemp
  fahrenheit.addEventListener("click", () => {
    changeTemp(imperial, data, "°F");
  });

  //Change fahrenheit to celsiusTemp
  celsius.addEventListener("click", () => {
    changeTemp(metric, data, "°C");
  });
}

//change background
const nightMode = document.querySelector(".night-mode");
const changeToDayMode = () => {
  nightMode.classList.remove("night-font");
  nightMode.classList.add("day-font");
};

const changeToNightMode = () => {
  nightMode.classList.add("night-font");
  nightMode.classList.remove("day-font");
};
function changeBackground(dataHour) {
  const videoChange = document.getElementById("video-change");
  const weatherCondition = dataHour.current.weather[0].main;
  const currentTime = +localTime(dataHour).slice(0, 2);

  if (
    (weatherCondition === "Clouds" ||
      weatherCondition === "Smoke" ||
      weatherCondition === "Haze" ||
      weatherCondition === "Dust" ||
      weatherCondition === "Fog" ||
      weatherCondition === "Sand" ||
      weatherCondition === "Ash") &&
    currentTime >= 4 &&
    currentTime <= 20
  ) {
    videoChange.src = "bg-video/cloudy.mp4";
    changeToDayMode();
  }
  if (
    (weatherCondition === "Clouds" ||
      weatherCondition === "Smoke" ||
      weatherCondition === "Haze" ||
      weatherCondition === "Dust" ||
      weatherCondition === "Fog" ||
      weatherCondition === "Sand" ||
      weatherCondition === "Ash") &&
    ((currentTime >= 21 && currentTime <= 24) ||
      (currentTime >= 1 && currentTime <= 3))
  ) {
    videoChange.src = "bg-video/cloudy_night.mp4";
    changeToNightMode();
  }
  if (weatherCondition === "Clear" && currentTime >= 4 && currentTime <= 20) {
    videoChange.src = "bg-video/sunny.mp4";
    changeToDayMode();
  }
  if (
    weatherCondition === "Clear" &&
    ((currentTime >= 21 && currentTime <= 24) ||
      (currentTime >= 1 && currentTime <= 3))
  ) {
    videoChange.src = "bg-video/sunny_night.mp4";
    changeToNightMode();
  }
  if (
    (weatherCondition === "Rain" ||
      weatherCondition === "Thunderstorm" ||
      weatherCondition === "Drizzle" ||
      weatherCondition === "Mist" ||
      weatherCondition === "Squall" ||
      weatherCondition === "Tornado") &&
    currentTime >= 4 &&
    currentTime <= 20
  ) {
    videoChange.src = "bg-video/rainy.mp4";
    changeToDayMode();
  }
  if (
    (weatherCondition === "Rain" ||
      weatherCondition === "Thunderstorm" ||
      weatherCondition === "Drizzle" ||
      weatherCondition === "Mist" ||
      weatherCondition === "Squall" ||
      weatherCondition === "Tornado") &&
    ((currentTime >= 21 && currentTime <= 24) ||
      (currentTime >= 1 && currentTime <= 3))
  ) {
    videoChange.src = "bg-video/rainy_night.mp4";
    changeToNightMode();
  }

  if (weatherCondition === "Snow" && currentTime >= 4 && currentTime <= 20) {
    videoChange.src = "bg-video/snow.mp4";
    changeToNightMode();
  }
  if (
    weatherCondition === "Snow" &&
    ((currentTime >= 21 && currentTime <= 24) ||
      (currentTime >= 1 && currentTime <= 3))
  ) {
    videoChange.src = "bg-video/snow_night.mp4";
    changeToNightMode();
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

let time = "";
function getHourlyWeather(data, units) {
  fetch(
    `${api.base}onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=${units}&exclude=curret,minutely,daily,alerts&appid=${api.key}`
  )
    .then((res) => {
      if (!res.ok) {
        alert("Something went wrong!");
      }
      res.json().then((dataHour) => {
        //render hourly content
        renderHourlyContent(dataHour);
        changeBackground(dataHour);
        //render local time and Date
        let time = localTime(dataHour).slice(0, 2);
        let time2 = localTime(dataHour).slice(3);
        let time3 = time2[0] === "0" ? time2.slice(1) : time2;
        localCurrentDate.innerHTML = `<p>Local time: ${
          time <= 9
            ? time.slice(1, 2) + ":" + time3 + "am"
            : time >= 10 && time <= 11
            ? time + ":" + time3 + "am"
            : time === 12
            ? time + ":" + time3 + "pm"
            : time >= 13 && time <= 23
            ? time - 12 + ":" + time3 + "pm"
            : (time = 12 + ":" + time3 + "am")
        }, ${localDate(dataHour)}</p>`;
      });
    })
    .catch((err) => {
      alert(`Something went wrong. ${err.message}`);
    });
}

//render hourly content
function renderHourlyContent(dataHour) {
  const hourlyWeatherContentTitle = `
  <div>
    <h2 class="sub-title">Hourly Forecast - ${allDataFromAPI.name}</h2>
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
          <p>${Math.round(dataHour.hourly[i].temp)}°</p>
          <img src="${iconUrl}"class="weather-icons" />
          <p>${
            hourResult <= 11
              ? hourResult + "am"
              : hourResult === 12
              ? hourResult + "pm"
              : hourResult >= 13 && hourResult <= 23
              ? hourResult - 12 + "pm"
              : (hourResult = 12 + "am")
          }</p>
        </div>
        </div>
      </div>`;

    containerForHourlyWeather.insertAdjacentHTML(
      "beforeend",
      hourlyWeatherContent
    );
  }

  hourlyTitle.innerHTML = hourlyWeatherContentTitle;
}

//get weekly result from Web API
function getWeeklyWeather(data, units) {
  fetch(
    `${api.base}onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=${units}&exclude=curret,minutely,hourly,alerts&appid=${api.key}`
  )
    .then((res) => {
      if (!res.ok) {
        alert("Something went wrong!");
      }
      res.json().then((dataWeek) => {
        //render weekly content
        renderWeeklyContent(dataWeek);
      });
    })
    .catch((err) => {
      alert(`Something went wrong. ${err.message}`);
    });
}

//render weekly content
function renderWeeklyContent(dataWeek) {
  const weeklyWeatherContentTitle = `
  <div>
    <h2 class="sub-title">Weekly Forecast - ${allDataFromAPI.name}</h2>
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
    containerForWeeklyWeather.insertAdjacentHTML(
      "beforeend",
      weeklyWeatherContent
    );
  }
  weeklyTitle.innerHTML = weeklyWeatherContentTitle;
}
