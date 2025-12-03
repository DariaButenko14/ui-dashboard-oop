// js/Dashboard.js
import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import WeatherWidget from './WeatherWidget.js';
import CryptoWidget from './CryptoWidget.js';

class Dashboard {
  constructor(container) {
    if (!container) throw new Error('Dashboard: container required');
    this.container = container;
    this.widgets = []; // { id, instance, type }
    this.setupLayout();
  }

  setupLayout() {
    this.container.classList.add('dashboard-grid');
    this.container.innerHTML = '';
  }

  addWidget(widgetType = 'todo') {
    const id = `${widgetType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    let instance;

    const cfg = { id };

    switch (widgetType) {
      case 'todo':
        cfg.title = 'Список дел';
        instance = new ToDoWidget(cfg);
        break;
      case 'quote':
        cfg.title = 'Цитаты';
        instance = new QuoteWidget(cfg);
        break;
      case 'weather':
        cfg.title = 'Погода';
        cfg.city = 'Moscow';
        instance = new WeatherWidget(cfg);
        break;
      case 'crypto':
        cfg.title = 'Криптовалюты';
        instance = new CryptoWidget(cfg);
        break;
      default:
        console.warn('Unknown widget type', widgetType);
        return null;
    }

    // Рендерим и добавляем в DOM
    const el = instance.render();
    this.container.appendChild(el);

    this.widgets.push({ id, instance, type: widgetType });
    this.updateWidgetCount();
    
    return instance;
  }

  removeWidget(widgetId) {
    const idx = this.widgets.findIndex(w => w.id === widgetId);
    if (idx === -1) return false;

    const { instance } = this.widgets[idx];
    try {
      instance.destroy();
    } catch (e) {
      console.error('Ошибка при удалении виджета', e);
    }
    this.widgets.splice(idx, 1);
    this.updateWidgetCount();
    return true;
  }

  findWidget(widgetId) {
    return this.widgets.find(w => w.id === widgetId) || null;
  }

  clearAll() {
    // Удаляем каждый виджет
    this.widgets.forEach(w => {
      try {
        w.instance.destroy();
      } catch (e) {
        console.error('Ошибка при удалении виджета', e);
      }
    });
    this.widgets = [];
    this.updateWidgetCount();
  }

  updateWidgetCount() {
    const countElement = document.getElementById('widget-count');
    if (countElement) {
      countElement.textContent = this.widgets.length;
    }
  }
}

export default Dashboard;