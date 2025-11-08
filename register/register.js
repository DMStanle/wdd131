import { participantTemplate, successTemplate } from './templates.js';

document.addEventListener('DOMContentLoaded', () => {
  let participantCount = 1;

  const addButton = document.querySelector('#add');
  const form = document.querySelector('form');
  const summary = document.querySelector('#summary');

  addButton.addEventListener('click', () => {
    participantCount += 1;
    addButton.insertAdjacentHTML('beforebegin', participantTemplate(participantCount));
  });

  function totalFees() {
    const feeElements = [...document.querySelectorAll('[id^=fee]')];
    return feeElements.reduce((sum, el) => sum + (Number(el.value) || 0), 0);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const count = document.querySelectorAll('section[class^="participant"]').length;
    const total = totalFees();
    const name = document.querySelector('#adult_name')?.value.trim() || '';

    form.classList.add('hide');
    summary.innerHTML = successTemplate({ name, count, total });
    summary.classList.remove('hide');
  });
});
