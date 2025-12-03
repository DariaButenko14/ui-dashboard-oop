// js/Dashboard.js
import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';

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
   * @param {string} widgetType - 'todo' | 'quote'
   */
  addWidget(widgetType = 'todo') {
    const id = `${widgetType}-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    let instance;

    const cfg = { id, title: widgetType === 'todo' ? 'Список дел' : 'Цитаты' };

    switch (widgetType) {
      case 'todo':
        instance = new ToDoWidget(cfg);
        break;
      case 'quote':
        instance = new QuoteWidget(cfg);
        break;
      default:
        console.warn('Unknown widget type', widgetType);
        return;
    }

    // Рендерим и добавляем в DOM
    const el = instance.render();
    this.container.appendChild(el);

    this.widgets.push({ id, instance, type: widgetType });
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
    return true;
  }

  /**
   * Найти виджет по id
   */
  findWidget(widgetId) {
    return this.widgets.find(w => w.id === widgetId) || null;
  }
}