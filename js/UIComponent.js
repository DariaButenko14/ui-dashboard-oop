// Базовый абстрактный класс
export default class UIComponent {
    constructor({ title, id }) {
      if (new.target === UIComponent) {
        throw new Error('UIComponent is abstract and cannot be instantiated directly');
      }
      this.title = title;
      this.id = id ?? crypto.randomUUID();
      this.element = null;
  
      // Сохраняем ссылки на обработчики, чтобы корректно удалить их в destroy()
      this._handlers = [];
    }
  
    // Создаёт обёртку и заголовок с кнопками
    _createBase() {
      const wrapper = document.createElement('div');
      wrapper.className = 'widget';
      wrapper.dataset.widgetId = this.id;
  
      const header = document.createElement('div');
      header.className = 'widget-header';
  
      const titleEl = document.createElement('h3');
      titleEl.textContent = this.title;
  
      const controls = document.createElement('div');
      controls.className = 'widget-controls';
      const btnMin = document.createElement('button');
      btnMin.className = 'icon-btn';
      btnMin.title = 'Свернуть/развернуть';
      btnMin.textContent = '—';
  
      const btnClose = document.createElement('button');
      btnClose.className = 'icon-btn danger';
      btnClose.title = 'Закрыть';
      btnClose.textContent = '×';
  
      controls.append(btnMin, btnClose);
      header.append(titleEl, controls);
  
      const body = document.createElement('div');
      body.className = 'widget-body';
  
      wrapper.append(header, body);
  
      // Логика кнопок (делегируем событие дашборду через кастомное событие)
      const onMinimize = () => body.classList.toggle('hidden');
      const onClose = () => {
        wrapper.dispatchEvent(new CustomEvent('widget:close', {
          bubbles: true,
          detail: { id: this.id }
        }));
      };
  
      btnMin.addEventListener('click', onMinimize);
      btnClose.addEventListener('click', onClose);
  
      // Запоминаем для удаления
      this._handlers.push({ target: btnMin, type: 'click', fn: onMinimize });
      this._handlers.push({ target: btnClose, type: 'click', fn: onClose });
  
      return { wrapper, body };
    }
  
    // Должен вернуть DOM-элемент виджета
    render() {
      throw new Error('render() must be implemented by subclass');
    }
  
    // Удаление слушателей и DOM
    destroy() {
      if (this.element) {
        // Удаляем все слушатели, которые мы сохраняли
        for (const { target, type, fn } of this._handlers) {
          target.removeEventListener(type, fn);
        }
        this._handlers = [];
        this.element.remove();
        this.element = null;
      }
    }
  }
  