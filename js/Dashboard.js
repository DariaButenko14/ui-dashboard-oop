import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import WeatherWidget from './WeatherWidget.js';

const widgetRegistry = {
  todo: (id) => new ToDoWidget({ title: 'Список дел', id }),
  quote: (id) => new QuoteWidget({ title: 'Случайная цитата (API)', id }),
  weather: (id) => new WeatherWidget({ title: 'Погода (API)', id }),
};

export default class Dashboard {
  constructor(container) {
    this.container = container;
    this.widgets = [];

    // Один общий слушатель: ловим закрытие любого виджета
    this._onWidgetClose = (e) => this.removeWidget(e.detail.id);
    this.container.addEventListener('widget:close', this._onWidgetClose);
  }

  addWidget(type) {
    const factory = widgetRegistry[type];
    if (!factory) return;

    const id = crypto.randomUUID();
    const widget = factory(id);
    const el = widget.render();
    this.container.appendChild(el);
    this.widgets.push(widget);
  }

  removeWidget(id) {
    const idx = this.widgets.findIndex(w => w.id === id);
    if (idx !== -1) {
      this.widgets[idx].destroy();
      this.widgets.splice(idx, 1);
    }
  }
}
