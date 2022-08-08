import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import notiflix from 'notiflix';

const timeRefs = {
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

const nowDate = new Date();
let selectedDate = null;
const btnStart = document.querySelector('button[data-start]');
btnStartDisabled(true);

const inputEl = document.querySelector('#datetime-picker');
btnStartDisabled(true);


btnStart.addEventListener('click', onStartClick);

function btnStartDisabled(isDisabled) {
  btnStart.disabled = isDisabled;
}

function inputDisabled(isDisabled) {
  inputEl.disabled = isDisabled;
}

function updateClockFace({ days, hours, minutes, seconds }) {
  timeRefs.days.textContent = pad(days);
  timeRefs.hours.textContent = pad(hours);
  timeRefs.minutes.textContent = pad(minutes);
  timeRefs.seconds.textContent = pad(seconds);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function onStartClick() {
  let timeDifference = selectedDate - nowDate;
  btnStartDisabled(true);
  inputDisabled(true);
  const setIntervalId = setInterval(() => {
    const seconds = new Date(timeDifference).getSeconds();
    timeDifference = new Date(timeDifference).setSeconds(seconds - 1);
    const time = convertMs(timeDifference);
    if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      clearInterval(setIntervalId);
      inputDisabled(false);
    }
    updateClockFace(time);
  }, 1000);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (nowDate > selectedDates[0]) {
      notiflix.Notify.failure('Please choose a date in the future');
    } else {
      btnStartDisabled(false);
      selectedDate = selectedDates[0];
    }
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
