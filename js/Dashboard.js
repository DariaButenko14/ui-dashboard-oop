// ... в конце класса Dashboard
getWidgetCount() {
    return this.#widgets.size;
}

// Также обновите методы addWidget и removeWidget чтобы возвращать ID:
addWidget(type, config = {}) {
    // ... существующий код ...
    
    // Обновляем счетчик виджетов
    this.#updateWidgetCount();
    return widgetId;
}

removeWidget(widgetId) {
    // ... существующий код ...
    
    // Обновляем счетчик виджетов
    this.#updateWidgetCount();
    return true;
}

clearAll() {
    // ... существующий код ...
    
    // Обновляем счетчик виджетов
    this.#updateWidgetCount();
}

#updateWidgetCount() {
    const countElement = document.getElementById('widget-count');
    if (countElement) {
        countElement.textContent = this.#widgets.size;
    }
}
// ...