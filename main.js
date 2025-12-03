// Импорт классов
import { UIComponent } from './ui/UIComponent.js';
import { ToDoWidget } from './ui/ToDoWidget.js';
import { QuoteWidget } from './ui/QuoteWidget.js';
import { WeatherWidget } from './ui/WeatherWidget.js';
import { CryptoWidget } from './ui/CryptoWidget.js';
import { Dashboard } from './ui/Dashboard.js';

// Делаем классы доступными глобально
window.UIComponent = UIComponent;
window.ToDoWidget = ToDoWidget;
window.QuoteWidget = QuoteWidget;
window.WeatherWidget = WeatherWidget;
window.CryptoWidget = CryptoWidget;

class App {
    constructor() {
        this.dashboard = new Dashboard('dashboard');
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateWidgetCount();
        console.log('Приложение инициализировано');
    }

    bindEvents() {
        // Кнопки добавления виджетов
        document.getElementById('add-todo').addEventListener('click', () => {
            this.dashboard.addWidget('todo', {
                title: 'ToDo List',
                todos: [
                    { text: 'Изучить ООП в JavaScript', completed: true },
                    { text: 'Создать дашборд', completed: true },
                    { text: 'Добавить API виджеты', completed: false }
                ]
            });
            this.updateWidgetCount();
        });

        document.getElementById('add-quote').addEventListener('click', () => {
            this.dashboard.addWidget('quote', {
                title: 'Daily Quote'
            });
            this.updateWidgetCount();
        });

        document.getElementById('add-weather').addEventListener('click', () => {
            this.dashboard.addWidget('weather', {
                title: 'Weather',
                city: 'Moscow'
            });
            this.updateWidgetCount();
        });

        document.getElementById('add-crypto').addEventListener('click', () => {
            this.dashboard.addWidget('crypto', {
                title: 'Cryptocurrency'
            });
            this.updateWidgetCount();
        });

        // Очистка всех виджетов
        document.getElementById('clear-all').addEventListener('click', () => {
            if (confirm('Удалить все виджеты?')) {
                this.dashboard.clearAll();
                this.updateWidgetCount();
            }
        });
    }

    updateWidgetCount() {
        const countElement = document.getElementById('widget-count');
        if (countElement) {
            // Используем setTimeout чтобы обновить счетчик после добавления/удаления
            setTimeout(() => {
                countElement.textContent = this.dashboard.getWidgetCount();
            }, 100);
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new App();
});