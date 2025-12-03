// js/UIComponent.js
// Базовый (абстрактный) класс для всех виджетов

export default class UIComponent {
  /**
   * @param {Object} config - конфигурация виджета { id, title }
   */
  constructor(config = {}) {
    if (new.target === UIComponent) {
      // Сделаем класс частично "абстрактным"
    }
    this.id = config.id || `widget-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    this.title = config.title || 'Widget';
    this._root = null;           // DOM-элемент обертки виджета
    this._listeners = [];        // { target, type, handler } для удобного удаления
    this.minimized = false;
  }

  /**
   * Рендерит виджет и возвращает DOM элемент.
   * Классы-наследники должны переопределять.
   * @returns {HTMLElement}
   */
  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('widget');
    wrapper.dataset.widgetId = this.id;

    const header = document.createElement('div');
    header.className = 'widget-header';

    const titleEl = document.createElement('h3');
    titleEl.textContent = this.title;

    const actions = document.createElement('div');
    actions.className = 'widget-actions';

    const minBtn = document.createElement('button');
    minBtn.textContent = '—';
    minBtn.title = 'Свернуть/развернуть';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.title = 'Закрыть';

    actions.append(minBtn, closeBtn);
    header.append(titleEl, actions);

    const body = document.createElement('div');
    body.className = 'widget-body';
    body.innerHTML = '<em>Пустой виджет</em>';

    wrapper.append(header, body);

    // Привязываем элементы к классу
    this._root = wrapper;
    this._body = body;
    this._header = header;

    // Обработчики по умолчанию
    const boundToggle = this._toggleMinimize.bind(this);
    const boundClose = this.destroy.bind(this);

    minBtn.addEventListener('click', boundToggle);
    closeBtn.addEventListener('click', boundClose);

    this._listeners.push({ target: minBtn, type: 'click', handler: boundToggle });
    this._listeners.push({ target: closeBtn, type: 'click', handler: boundClose });

    return wrapper;
  }

  /**
   * Свернуть/развернуть
   */
  _toggleMinimize() {
    this.minimized = !this.minimized;
    if (this._body) {
      this._body.style.display = this.minimized ? 'none' : '';
    }
  }

  /**
   * Удаляет виджет из DOM и снимает слушатели
   */
  destroy() {
    // удаляем все зарегистрированные слушатели
    for (const { target, type, handler } of this._listeners) {
      try {
        target.removeEventListener(type, handler);
      } catch (e) {
        // ignore
      }
    }
    this._listeners = [];

    // убираем элемент из DOM
    if (this._root && this._root.parentElement) {
      this._root.parentElement.removeChild(this._root);
    }

    // дополнительные действия в наследниках (если нужно)
    if (typeof this.onDestroy === 'function') {
      try { this.onDestroy(); } catch (e) { /*ignore*/ }
    }
  }
}