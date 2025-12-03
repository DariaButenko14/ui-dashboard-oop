export class Dashboard {
    #widgets;
    #container;
    #emptyState;

    constructor(containerId) {
        this.#widgets = new Map();
        this.#container = document.getElementById(containerId);
        
        if (this.#container) {
            this.#emptyState = this.#container.querySelector('#empty-state');
        }
    }

    addWidget(type, config = {}) {
        let widget;
        const widgetId = config.id || `${type}-${Date.now()}`;

        switch (type.toLowerCase()) {
            case 'todo':
                widget = new window.ToDoWidget({ ...config, id: widgetId });
                break;
            case 'quote':
                widget = new window.QuoteWidget({ ...config, id: widgetId });
                break;
            case 'weather':
                widget = new window.WeatherWidget({ ...config, id: widgetId });
                break;
            case 'crypto':
                widget = new window.CryptoWidget({ ...config, id: widgetId });
                break;
            default:
                console.error(`Неизвестный тип виджета: ${type}`);
                return null;
        }

        const widgetElement = widget.create();
        this.#widgets.set(widgetId, widget);
        
        // Скрываем состояние "пустой дашборд"
        if (this.#emptyState && this.#emptyState.style.display !== 'none') {
            this.#emptyState.style.display = 'none';
        }
        
        // Добавляем виджет в контейнер
        if (this.#container) {
            this.#container.appendChild(widgetElement);
        }
        
        // Обновляем счетчик виджетов
        this.#updateWidgetCount();
        
        return widgetId;
    }

    removeWidget(widgetId) {
        const widget = this.#widgets.get(widgetId);
        
        if (widget) {
            widget.destroy();
            this.#widgets.delete(widgetId);
            
            // Показываем состояние "пустой дашборд", если виджетов не осталось
            if (this.#widgets.size === 0 && this.#emptyState) {
                this.#emptyState.style.display = 'block';
            }
            
            this.#updateWidgetCount();
            return true;
        }
        
        return false;
    }

    getWidget(widgetId) {
        return this.#widgets.get(widgetId);
    }

    getAllWidgets() {
        return Array.from(this.#widgets.values());
    }

    clearAll() {
        this.#widgets.forEach(widget => widget.destroy());
        this.#widgets.clear();
        
        if (this.#emptyState) {
            this.#emptyState.style.display = 'block';
        }
        
        this.#updateWidgetCount();
    }

    #updateWidgetCount() {
        const countElement = document.getElementById('widget-count');
        if (countElement) {
            countElement.textContent = this.#widgets.size;
        }
    }

    getWidgetCount() {
        return this.#widgets.size;
    }
}