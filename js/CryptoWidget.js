// js/CryptoWidget.js
import UIComponent from './UIComponent.js';

export default class CryptoWidget extends UIComponent {
  constructor(config = {}) {
    super({ title: config.title || 'Криптовалюты', id: config.id });
    this.cryptoData = null;
    this._listenersLocal = [];
  }

  render() {
    const root = super.render();
    this._body.innerHTML = '';

    const cryptoWrap = document.createElement('div');
    cryptoWrap.className = 'crypto-wrap';

    const list = document.createElement('ul');
    list.className = 'crypto-list';

    const btn = document.createElement('button');
    btn.className = 'crypto-refresh';
    btn.textContent = 'Обновить';

    cryptoWrap.append(list, btn);
    this._body.append(cryptoWrap);

    const onRefresh = (e) => {
      this._fetchCrypto();
    };

    btn.addEventListener('click', onRefresh);
    this._listeners.push({ target: btn, type: 'click', handler: onRefresh });

    this._refs = { list, btn };

    // начальная загрузка
    this._fetchCrypto();

    return root;
  }

  async _fetchCrypto() {
    try {
      // В реальном проекте можно использовать CoinGecko API
      // const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum&order=market_cap_desc&per_page=5&page=1&sparkline=false');
      
      // Демо-данные для примера
      await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки сети
      
      this.cryptoData = [
        { name: 'Bitcoin', symbol: 'BTC', price: (Math.random() * 10000 + 30000).toFixed(2), change: (Math.random() * 10 - 5).toFixed(2) },
        { name: 'Ethereum', symbol: 'ETH', price: (Math.random() * 2000 + 1500).toFixed(2), change: (Math.random() * 10 - 5).toFixed(2) },
        { name: 'Solana', symbol: 'SOL', price: (Math.random() * 100 + 20).toFixed(2), change: (Math.random() * 10 - 5).toFixed(2) },
        { name: 'Cardano', symbol: 'ADA', price: (Math.random() * 1 + 0.3).toFixed(3), change: (Math.random() * 10 - 5).toFixed(2) },
      ];
      
      this._updateCrypto();
    } catch (error) {
      console.error('Ошибка при получении данных о криптовалютах:', error);
      const list = this._refs.list;
      list.innerHTML = '<li>Ошибка загрузки данных</li>';
    }
  }

  _updateCrypto() {
    if (!this._refs) return;
    const list = this._refs.list;
    list.innerHTML = '';
    
    if (this.cryptoData) {
      this.cryptoData.forEach(crypto => {
        const li = document.createElement('li');
        li.className = 'crypto-item';
        li.innerHTML = `
          <span class="crypto-name">${crypto.name} (${crypto.symbol})</span>
          <span class="crypto-price">$${crypto.price}</span>
          <span class="crypto-change ${parseFloat(crypto.change) >= 0 ? 'positive' : 'negative'}">
            ${parseFloat(crypto.change) >= 0 ? '+' : ''}${crypto.change}%
          </span>
        `;
        list.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'Данные не загружены';
      list.appendChild(li);
    }
  }

  onDestroy() {
    this._refs = null;
  }
}