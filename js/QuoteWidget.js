// js/QuoteWidget.js
import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
  constructor(config = {}) {
    super({ title: config.title || 'Quote', id: config.id });
    // Набор цитат — можно расширить
    this.quotes = [
      "Не тот велик, кто никогда не падал, а тот велик — кто падал и вставал. — Конфуций",
      "Учитесь, пока живы; если вы умрете, учиться будет поздно. — Леонардо да Винчи",
      "Секрет изменений — сосредоточить всю свою энергию не на борьбе со старым, а на создании нового. — Сократ",
      "Лучше сделать и пожалеть, чем не сделать и пожалеть. — неизвестный",
      "Кто хочет — ищет возможность. Кто не хочет — ищет причину. — неизвестный"
    ];
    this.current = null;
    // bound handlers
    this._listenersLocal = [];
  }

  render() {
    const root = super.render();
    this._body.innerHTML = '';

    const quoteWrap = document.createElement('div');
    quoteWrap.className = 'quote-wrap';

    const quoteText = document.createElement('blockquote');
    quoteText.className = 'quote-text';
    quoteText.textContent = '';

    const btn = document.createElement('button');
    btn.className = 'quote-refresh';
    btn.textContent = 'Обновить';

    quoteWrap.append(quoteText, btn);
    this._body.append(quoteWrap);

    const onRefresh = (e) => {
      this._setRandomQuote();
      this._updateQuoteText();
    };

    btn.addEventListener('click', onRefresh);
    this._listeners.push({ target: btn, type: 'click', handler: onRefresh });

    // initial
    this._setRandomQuote();
    this._updateQuoteText();

    // ссылки
    this._refs = { quoteText, btn };

    return root;
  }

  _setRandomQuote() {
    if (!this.quotes || this.quotes.length === 0) {
      this.current = 'Нет цитат.';
      return;
    }
    const idx = Math.floor(Math.random() * this.quotes.length);
    this.current = this.quotes[idx];
  }

  _updateQuoteText() {
    if (this._refs && this._refs.quoteText) {
      this._refs.quoteText.textContent = this.current;
    }
  }

  onDestroy() {
    this._refs = null;
  }
}