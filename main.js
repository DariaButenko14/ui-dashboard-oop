import Dashboard from './js/Dashboard.js';

const container = document.getElementById('dashboard');
const dashboard = new Dashboard(container);

// Кнопки добавления
document.getElementById('add-todo').addEventListener('click', () => {
  dashboard.addWidget('todo');
});

document.getElementById('add-quote').addEventListener('click', () => {
  dashboard.addWidget('quote');
});

document.getElementById('add-weather').addEventListener('click', () => {
  dashboard.addWidget('weather');
});
