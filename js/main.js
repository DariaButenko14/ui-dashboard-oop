// js/main.js
import Dashboard from './Dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
  const dashboardContainer = document.getElementById('dashboard');
  if (!dashboardContainer) {
    console.error('Не найден контейнер для дашборда');
    return;
  }

  const dashboard = new Dashboard(dashboardContainer);

  // Кнопки добавления виджетов
  document.getElementById('add-todo')?.addEventListener('click', () => {
    dashboard.addWidget('todo');
  });
  
  document.getElementById('add-quote')?.addEventListener('click', () => {
    dashboard.addWidget('quote');
  });
  
  document.getElementById('add-weather')?.addEventListener('click', () => {
    dashboard.addWidget('weather');
  });
  
  document.getElementById('add-crypto')?.addEventListener('click', () => {
    dashboard.addWidget('crypto');
  });
  
  document.getElementById('clear-all')?.addEventListener('click', () => {
    if (dashboard.widgets.length > 0 && confirm('Удалить все виджеты?')) {
      dashboard.clearAll();
    }
  });

  console.log('Дашборд инициализирован');
});