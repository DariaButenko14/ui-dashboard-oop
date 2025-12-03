// js/ToDoWidget.js
import UIComponent from "./UIComponent.js";

class ToDoWidget extends UIComponent {
  constructor(config = {}) {
    super({ title: config.title || "ToDo", id: config.id });
    this.tasks = [];
    this._handlers = {};
  }

  render() {
    const root = super.render();
    this._body.innerHTML = "";

    const form = document.createElement("form");
    form.className = "todo-form";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Новая задача...";
    input.required = true;

    const addBtn = document.createElement("button");
    addBtn.type = "submit";
    addBtn.textContent = "Добавить";

    form.append(input, addBtn);

    const list = document.createElement("ul");
    list.className = "todo-list";

    this._body.append(form, list);

    const onSubmit = (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      this.addTask(text);
      input.value = "";
      input.focus();
    };

    const onListClick = (e) => {
      const li = e.target.closest("li");
      if (!li || !list.contains(li)) return;
      const taskId = li.dataset.taskId;
      if (e.target.classList.contains("task-delete")) {
        this.removeTask(taskId);
      } else if (e.target.classList.contains("task-toggle") || e.target.tagName === "LABEL") {
        this.toggleTask(taskId);
      }
    };

    form.addEventListener("submit", onSubmit);
    list.addEventListener("click", onListClick);

    this._listeners.push({ target: form, type: "submit", handler: onSubmit });
    this._listeners.push({ target: list, type: "click", handler: onListClick });

    this._refs = { input, list, form };

    this._renderList();

    return root;
  }

  _renderList() {
    const list = this._refs.list;
    list.innerHTML = "";
    if (this.tasks.length === 0) {
      const li = document.createElement("li");
      li.className = "todo-empty";
      li.textContent = "Нет задач.";
      list.appendChild(li);
      return;
    }

    for (const task of this.tasks) {
      const li = document.createElement("li");
      li.dataset.taskId = task.id;
      li.className = "todo-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-toggle";
      checkbox.checked = !!task.done;
      checkbox.id = `${this.id}-task-${task.id}`;

      const label = document.createElement("label");
      label.setAttribute("for", checkbox.id);
      label.textContent = task.text;
      if (task.done) label.classList.add("done");

      const delBtn = document.createElement("button");
      delBtn.className = "task-delete";
      delBtn.textContent = "Удалить";

      li.append(checkbox, label, delBtn);
      list.appendChild(li);
    }
  }

  addTask(text) {
    const task = {
      id: `${Date.now()}-${Math.floor(Math.random()*1000)}`,
      text,
      done: false
    };
    this.tasks.push(task);
    this._renderList();
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this._renderList();
  }

  toggleTask(taskId) {
    this.tasks = this.tasks.map(t => {
      if (t.id === taskId) return { ...t, done: !t.done };
      return t;
    });
    this._renderList();
  }

  onDestroy() {
    this._refs = null;
  }
}

export default ToDoWidget;
