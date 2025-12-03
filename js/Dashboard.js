// js/Dashboard.js
import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import WeatherWidget from './WeatherWidget.js';
import CryptoWidget from './CryptoWidget.js';

export default class Dashboard {
  /**
   * @param {HTMLElement} container - DOM элемент, куда будет рендериться сетка виджетов
   */
  constructor(container) {
    if (!container) throw new Error('Dashboard: container required');
    this.container = container;
    this.widgets = []; // { id, instance, type }
    this._setupLayout();
  }

  _setupLayout() {
    this.container.classList.add('dashboard-grid');
    // чистим контейнер
    this.container.innerHTML = '';
  }

  /**
   * Добавить виджет указанного типа
   * @param {string} widgetType - 'todo' | 'quote' | 'weather' | 'crypto'
   */
  addWidget(widgetType = 'todo') {
    const id = `${widgetType}-${Date.now()}-${Math.floor(Math.random()*1000)}`;
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
        return;
    }

    // Рендерим и добавляем в DOM
    const el = instance.render();
    this.container.appendChild(el);

    this.widgets.push({ id, instance, type: widgetType });
    this._updateWidgetCount();
    
    return instance;
  }

  /**
   * Удалить виджет по id
   * @param {string} widgetId
   */
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
    this._updateWidgetCount();
    return true;
  }

  /**
   * Найти виджет по id
   */
  findWidget(widgetId) {
    return this.widgets.find(w => w.id === widgetId) || null;
  }

  /**
   * Очистить все виджеты
   */
  clearAll() {
    // Создаем копию массива, чтобы безопасно удалять
    const widgetsCopy = [...this.widgets];
    widgetsCopy.forEach(w => {
      this.removeWidget(w.id);
    });
  }

  _updateWidgetCount() {
    const countElement = document.getElementById('widget-count');
    if (countElement) {
      countElement.textContent = this.widgets.length;
    }
  }
}