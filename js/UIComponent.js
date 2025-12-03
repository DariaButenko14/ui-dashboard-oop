// Базовый класс для всех виджетов
export class UIComponent {
    #id;
    #title;
    #icon;

    constructor(config = {}) {
        this.#id = config.id || `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.#title = config.title || 'Виджет';
        this.#icon = config.icon || 'fas fa-cube';
        this.isMinimized = false;
        this.element = null;
    }

    // Геттеры для приватных полей
    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    get icon() {
        return this.#icon;
    }

    // Абстрактный метод render (должен быть переопределен в дочерних классах)
    render() {
        throw new Error('Метод render должен быть реализован в дочернем классе');
    }

    // Создает базовую структуру виджета
    #createWidgetElement(content) {
        const widget = document.createElement('div');
        widget.className = 'widget';
        widget.id = this.#id;
        widget.dataset.widgetId = this.#id;

        widget.innerHTML = `
            <div class="widget-header">
                <div class="widget-title">
                    <i class="${this.#icon}"></i>
                    <span>${this.#title}</span>
                </div>
                <div class="widget-controls">
                    <button class="widget-btn minimize-btn" title="Свернуть">
                        <i class="fas ${this.isMinimized ? 'fa-expand' : 'fa-minus'}"></i>
                    </button>
                    <button class="widget-btn close-btn" title="Закрыть">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="widget-content">
                ${content}
            </div>
        `;

        return widget;
    }

    // Добавляет обработчики событий для виджета
    #addEventListeners(element) {
        const closeBtn = element.querySelector('.close-btn');
        const minimizeBtn = element.querySelector('.minimize-btn');
        const content = element.querySelector('.widget-content');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.destroy());
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                this.isMinimized = !this.isMinimized;
                content.style.display = this.isMinimized ? 'none' : 'block';
                minimizeBtn.innerHTML = `<i class="fas ${this.isMinimized ? 'fa-expand' : 'fa-minus'}"></i>`;
            });
        }
    }

    // Создает и возвращает готовый виджет
    create() {
        const content = this.render();
        const widgetElement = this.#createWidgetElement(content);
        this.element = widgetElement;
        this.#addEventListeners(widgetElement);
        return widgetElement;
    }

    // Уничтожает виджет
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
            this.onDestroy();
        }
    }

    // Метод, вызываемый при уничтожении (можно переопределить)
    onDestroy() {
        console.log(`Виджет ${this.#id} уничтожен`);
    }

    // Обновляет содержимое виджета
    update(content) {
        if (this.element) {
            const contentElement = this.element.querySelector('.widget-content');
            if (contentElement) {
                contentElement.innerHTML = content;
            }
        }
    }
}