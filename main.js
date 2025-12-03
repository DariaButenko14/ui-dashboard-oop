// Импорт классов
import { UIComponent } from './ui/UIComponent.js';
import { ToDoWidget } from './ui/ToDoWidget.js';
import { QuoteWidget } from './ui/QuoteWidget.js';
import { WeatherWidget } from './ui/WeatherWidget.js';
import { CryptoWidget } from './ui/CryptoWidget.js';
import { Dashboard } from './ui/Dashboard.js';

// Делаем классы доступными глобально (для Dashboard)
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
        this.loadFromStorage();
        console.log('Приложение инициализировано');
    }

    bindEvents() {
        // Кнопки добавления виджетов
        document.getElementById('add-todo').addEventListener('click', () => {
            this.dashboard.addWidget('todo', {
                title: 'Мой список дел',
                todos: [
                    { text: 'Изучить ООП в JavaScript', completed: true },
                    { text: 'Создать дашборд', completed: true },
                    { text: 'Добавить API виджеты', completed: false }
                ]
            });
        });

        document.getElementById('add-quote').addEventListener('click', () => {
            this.dashboard.addWidget('quote', {
                title: 'Мотивационная цитата'
            });
        });

        document.getElementById('add-weather').addEventListener('click', () => {
            this.dashboard.addWidget('weather', {
                title: 'Погода в Москве',
                city: 'Moscow'
            });
        });

        document.getElementById('add-crypto').addEventListener('click', () => {
            this.dashboard.addWidget('crypto', {
                title: 'Курсы криптовалют'
            });
        });

        // Очистка всех виджетов
        document.getElementById('clear-all').addEventListener('click', () => {
            if (confirm('Удалить все виджеты?')) {
                this.dashboard.clearAll();
            }
        });

        // Сохранение состояния при закрытии страницы
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
    }

    saveToStorage() {
        // В реальном приложении здесь можно сохранять состояние
        console.log('Сохранение состояния...');
    }

    loadFromStorage() {
        // В реальном приложении здесь можно загружать состояние
        console.log('Загрузка состояния...');
    }
}

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new App();
});