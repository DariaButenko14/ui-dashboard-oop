import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
    #todos;

    constructor(config = {}) {
        super({
            title: config.title || 'Список дел',
            icon: 'fas fa-tasks',
            id: config.id
        });
        
        this.#todos = config.todos || [];
    }

    render() {
        return `
            <div class="todo-container">
                <div class="todo-input-group">
                    <input type="text" class="todo-input" placeholder="Добавить новую задачу..." maxlength="100">
                    <button class="btn btn-primary todo-add-btn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <ul class="todo-list">
                    ${this.#renderTodoList()}
                </ul>
                
                <div class="todo-stats">
                    <small>Всего задач: ${this.#todos.length} | Выполнено: ${this.#getCompletedCount()}</small>
                </div>
            </div>
        `;
    }

    #renderTodoList() {
        if (this.#todos.length === 0) {
            return '<li class="todo-empty">Нет задач. Добавьте первую задачу!</li>';
        }

        return this.#todos.map((todo, index) => `
            <li class="todo-item" data-index="${index}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                <button class="todo-delete" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');
    }

    #getCompletedCount() {
        return this.#todos.filter(todo => todo.completed).length;
    }

    create() {
        const element = super.create();
        this.#setupEventListeners(element);
        return element;
    }

    #setupEventListeners(element) {
        // Добавление новой задачи
        const addBtn = element.querySelector('.todo-add-btn');
        const input = element.querySelector('.todo-input');

        const addTodo = () => {
            const text = input.value.trim();
            if (text) {
                this.#todos.push({ text, completed: false });
                input.value = '';
                this.#updateView(element);
            }
        };

        addBtn.addEventListener('click', addTodo);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });

        // Делегирование событий для списка
        const todoList = element.querySelector('.todo-list');
        todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            const index = parseInt(todoItem.dataset.index);

            // Удаление задачи
            if (e.target.closest('.todo-delete')) {
                this.#todos.splice(index, 1);
                this.#updateView(element);
            }
            // Переключение статуса выполнения
            else if (e.target.classList.contains('todo-checkbox')) {
                this.#todos[index].completed = e.target.checked;
                this.#updateView(element);
            }
        });
    }

    #updateView(element) {
        const todoList = element.querySelector('.todo-list');
        const stats = element.querySelector('.todo-stats');
        
        if (todoList) {
            todoList.innerHTML = this.#renderTodoList();
        }
        
        if (stats) {
            stats.innerHTML = `<small>Всего задач: ${this.#todos.length} | Выполнено: ${this.#getCompletedCount()}</small>`;
        }
    }

    onDestroy() {
        console.log(`ToDoWidget сохранено ${this.#todos.length} задач`);
    }
}