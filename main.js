// main.js
import Dashboard from './js/Dashboard.js';

// Инициализация
const dashboardContainer = document.getElementById('dashboardContainer');
const dashboard = new Dashboard(dashboardContainer);

// Кнопки управления
document.getElementById('addTodoBtn').addEventListener('click', () => {
  dashboard.addWidget('todo');
});

document.getElementById('addQuoteBtn').addEventListener('click', () => {
  dashboard.addWidget('quote');
});

document.getElementById('addWeatherBtn').addEventListener('click', () => {
  dashboard.addWidget('weather');
});

document.getElementById('addCryptoBtn').addEventListener('click', () => {
  dashboard.addWidget('crypto');
});

document.getElementById('clearAllBtn').addEventListener('click', () => {
  // Удаляем все виджеты корректно через Dashboard API
  const ids = dashboard.widgets.map(w => w.id);
  ids.forEach(id => dashboard.removeWidget(id));
});

// Добавим пару виджетов по умолчанию для демонстрации
dashboard.addWidget('todo');
dashboard.addWidget('quote');

export { dashboard };