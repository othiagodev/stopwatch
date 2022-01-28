const timerElement = document.querySelector("#root > main.content > div > span");
const timerMiniElement = document.querySelector("#root > main.content > div > span.mini");
const playElement = document.querySelector("#root > main.content button.play");
const resetElement = document.querySelector("#root > main.content button.refresh");
const divideElement = document.querySelector("#root > main.content button.divide");
const inputElement = document.querySelector("#root > main.content .inputContainer input");

const getTimer = parseInt(localStorage.getItem("timer"));
const getPauseTimer = parseInt(localStorage.getItem("pauseTimer"));
const valueInputElement = localStorage.getItem("valueInputElement");
const divisionState =  localStorage.getItem("divisionState");
let timer = getTimer ? getTimer : 0;
let lastTimeResult = 0;
let pauseTimer = 0;
let timerInterval;
let isOn = false;
let isDivide = divisionState === "true" ? true : false;
let divisionValue = valueInputElement != '' && valueInputElement != 0 && valueInputElement >= 1 ? parseFloat(valueInputElement) : 1;

playElement.addEventListener("click", start);
resetElement.addEventListener("click", refresh);
divideElement.addEventListener("click", divide);
inputElement.addEventListener("keyup", inputChange);

if (getPauseTimer) {
  const now = new Date().getTime();
  let count = (now - timer - Number.parseInt(now - getPauseTimer)).toFixed(0);

  lastTimeResult = count;
  setTimer(count);
  pauseTimer = getPauseTimer;

} else if (timer) {
  isOn = true;
  changeIconButtonPlay(isOn);
  play();
}

if (isDivide) {
  const el = document.querySelector("#root > main.content .inputContainer");
  el.style.height = "3.6rem";
  inputElement.value = valueInputElement;

} else {
  inputElement.value = valueInputElement;
}

function play() {
  const now = new Date().getTime();
  if (!timer) {
    timer = now
    localStorage.setItem("timer", timer);
  }

  if (pauseTimer) {
    timer += Number.parseInt(now - pauseTimer);
    localStorage.setItem("timer", timer);
    localStorage.setItem("pauseTimer", 0);
    pauseTimer = 0;
  }

  timerInterval = setInterval(handlerTimer, 1);
}

function pause() {
  pauseTimer = new Date().getTime();
  clearInterval(timerInterval);
  localStorage.setItem("pauseTimer", pauseTimer);
}

function refresh() {
  if (isOn) {
    timer = new Date().getTime();
    localStorage.setItem("timer", timer);
    setTimer("0");
    lastTimeResult = 0;

  } else {
    pauseTimer = 0;
    timer = 0;
    localStorage.clear();
    clearInterval(timerInterval);
    setTimer("0");
    lastTimeResult = 0;
  }
}

function start() {
  if (!isOn) {
    isOn = true;
    changeIconButtonPlay(isOn);
    play();

  } else {
    isOn = false;
    changeIconButtonPlay(isOn);
    pause();
  }
}

function divide() {
  const el = document.querySelector("#root > main.content .inputContainer");

  if (isDivide) {
    el.style.height = "0";
    isDivide = !isDivide;
    localStorage.setItem("divisionState", isDivide);
    divisionValue = 1
    if (!isOn) setTimer(lastTimeResult);
    
  } else {
    const valueInput = inputElement.value;
    el.style.height = "3.6rem";
    isDivide = !isDivide;
    localStorage.setItem("divisionState", isDivide);
    divisionValue = valueInput != '' && valueInput != 0 && valueInput >= 1 ? parseFloat(valueInput) : 1;
    if (!isOn) setTimer(lastTimeResult);
  }
}

function inputChange() {
  localStorage.setItem("valueInputElement", inputElement.value)
  const value = parseFloat(inputElement.value);

  if (!isDivide || inputElement.value === '') {
    divisionValue = 1;
    if (!isOn) setTimer(lastTimeResult);

  } else if (isDivide && value != 0 && value >= 1 ) {
    divisionValue = value;
    if (!isOn) setTimer(lastTimeResult);
  }

}

function changeIconButtonPlay(isOn) {
  if (isOn) {
    playElement.children[0].src = "../src/assets/pause.svg";
  } else {
    playElement.children[0].src = "../src/assets/play.svg";
  }
}

function handlerTimer() {
  const count = (new Date().getTime() - timer).toFixed(0);
  lastTimeResult = count;
  setTimer(count);
}

function setTimer(number) {
  const date = convertTimestampToTime(parseInt(number / ((isDivide) ? divisionValue : 1)));

  timerElement.innerHTML = date.normal;
  timerMiniElement.innerHTML = date.mini;
}

function convertTimestampToTime(number) {
  const seconds = 1;
  const minutes = seconds * 60;
  const hours = minutes * 60;

  let sNumber = number.toString();
  const time = {
    milliseconds: "000",
    seconds: "00",
    minutes: "00",
    hours: "00",
  };

  const milliseconds = sNumber.substring(sNumber.length - 3, sNumber.length);
  switch (milliseconds.length) {
    case 1:
      time.milliseconds = `00${milliseconds}`;
      break;
    case 2:
      time.milliseconds = `0${milliseconds}`;
      break;
    case 3:
      time.milliseconds = milliseconds;
      break;
  }

  sNumber = sNumber.substring(0, sNumber.length - 3);

  if (sNumber >= hours) {
    let q = Math.floor(sNumber / hours);
    time.hours = q < 10 ? `0${q}` : `${q}`;
    sNumber -= q * hours;
  }

  if (sNumber >= minutes) {
    let q = Math.floor(sNumber / minutes);
    time.minutes = q < 10 ? `0${q}` : `${q}`;
    sNumber -= q * minutes;
  }

  if (sNumber >= seconds) {
    let q = sNumber;
    time.seconds = q < 10 ? `0${q}` : `${q}`;
  }

  return {
    normal: `${time.hours}:${time.minutes}:${time.seconds}`,
    mini: `${time.milliseconds}`,
  };
}
