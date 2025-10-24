import UIComponent from './UIComponent.js';

export default class ToDoWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.tasks = []; // { id, text, done }
  }

  render() {
    const { wrapper, body } = this._createBase();

    body.innerHTML = `
      <div class="todo-input">
        <input type="text" placeholder="Новая задача..." />
        <button class="add">Добавить</button>
      </div>
      <ul class="todo-list"></ul>
    `;

    const input = body.querySelector('input');
    const btnAdd = body.querySelector('.add');
    const list = body.querySelector('.todo-list');

    const addTask = () => {
      const text = input.value.trim();
      if (!text) return;
      const t = { id: crypto.randomUUID(), text, done: false };
      this.tasks.push(t);
      renderList();
      input.value = '';
      input.focus();
    };

    const toggleTask = (id) => {
      const t = this.tasks.find(x => x.id === id);
      if (t) { t.done = !t.done; renderList(); }
    };

    const removeTask = (id) => {
      this.tasks = this.tasks.filter(x => x.id !== id);
      renderList();
    };

    const renderList = () => {
      list.innerHTML = '';
      this.tasks.forEach(t => {
        const li = document.createElement('li');
        li.className = t.done ? 'done' : '';
        li.innerHTML = `
          <label>
            <input type="checkbox" ${t.done ? 'checked' : ''}>
            <span>${t.text}</span>
          </label>
          <button class="remove">×</button>
        `;
        // обработчики
        const chk = li.querySelector('input[type="checkbox"]');
        const btnRemove = li.querySelector('.remove');

        const onChk = () => toggleTask(t.id);
        const onRemove = () => removeTask(t.id);

        chk.addEventListener('change', onChk);
        btnRemove.addEventListener('click', onRemove);

        // сохраняем, чтобы корректно убрать в destroy()
        this._handlers.push({ target: chk, type: 'change', fn: onChk });
        this._handlers.push({ target: btnRemove, type: 'click', fn: onRemove });

        list.appendChild(li);
      });
    };

    const onAddClick = addTask;
    const onEnter = (e) => { if (e.key === 'Enter') addTask(); };

    btnAdd.addEventListener('click', onAddClick);
    input.addEventListener('keydown', onEnter);

    this._handlers.push({ target: btnAdd, type: 'click', fn: onAddClick });
    this._handlers.push({ target: input, type: 'keydown', fn: onEnter });

    this.element = wrapper;
    return wrapper;
  }
}
