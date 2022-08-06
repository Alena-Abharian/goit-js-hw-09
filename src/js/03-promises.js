import notiflix from 'notiflix';

const formEl = document.querySelector('.form');

formEl.addEventListener('submit', onGetFormValue);

function onGetFormValue(e) {
  e.preventDefault();
  let counter = 0;
  let delay = Number(e.target.delay.value); //1000
  const step = Number(e.target.step.value); //500
  const amount = Number(e.target.amount.value);

  setTimeout(() => {
    const setIntervalId = setInterval(() => {
      if (amount === counter) {
        clearInterval(setIntervalId);
      } else {
        counter += 1;
        createPromise(counter, delay)
          .then(({ position, delay }) => {
            notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
          })
          .catch(({ position, delay }) => {
            notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
          });
        delay += step;
      }
    }, step);
  }, delay);
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  const response = { position, delay };
  if (shouldResolve) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
}


