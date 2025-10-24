import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.current = { content: 'Загружаю...', author: '' };
  }

  async fetchQuote() {
    try {
      const res = await fetch('https://api.quotable.io/random');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      this.current = { content: data.content, author: data.author };
    } catch (e) {
      this.current = { content: 'Не удалось загрузить цитату 😢', author: '' };
      // В реальном приложении логируем e
    }
  }

  async render() {
    const { wrapper, body } = this._createBase();

    body.innerHTML = `
      <blockquote class="quote">
        <p class="quote-text">...</p>
        <cite class="quote-author"></cite>
      </blockquote>
      <button class="refresh">Обновить</button>
    `;

    const textEl = body.querySelector('.quote-text');
    const authorEl = body.querySelector('.quote-author');
    const btn = body.querySelector('.refresh');

    const updateUI = () => {
      textEl.textContent = this.current.content;
      authorEl.textContent = this.current.author ? `— ${this.current.author}` : '';
    };

    const onRefresh = async () => {
      btn.disabled = true;
      btn.textContent = 'Загрузка...';
      await this.fetchQuote();
      updateUI();
      btn.disabled = false;
      btn.textContent = 'Обновить';
    };

    btn.addEventListener('click', onRefresh);
    this._handlers.push({ target: btn, type: 'click', fn: onRefresh });

    // первичная загрузка
    await onRefresh();

    this.element = wrapper;
    return wrapper;
  }
}
