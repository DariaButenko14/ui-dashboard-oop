// js/CryptoWidget.js
import UIComponent from './UIComponent.js';

export default class CryptoWidget extends UIComponent {
  constructor(config = {}) {
    super({ title: config.title || 'Криптовалюты', id: config.id });
    
    // Начальные данные криптовалют
    this.cryptos = [
      { 
        id: 'bitcoin',
        name: 'Bitcoin', 
        symbol: 'BTC',
        price: (Math.random() * 20000 + 30000).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2)
      },
      { 
        id: 'ethereum',
        name: 'Ethereum', 
        symbol: 'ETH',
        price: (Math.random() * 1000 + 1500).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2)
      },
      { 
        id: 'solana',
        name: 'Solana', 
        symbol: 'SOL',
        price: (Math.random() * 50 + 20).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2)
      },
      { 
        id: 'cardano',
        name: 'Cardano', 
        symbol: 'ADA',
        price: (Math.random() * 0.5 + 0.3).toFixed(3),
        change: (Math.random() * 10 - 5).toFixed(2)
      }
    ];
    
    this._handlers = {};
  }

  render() {
    const root = super.render();
    this._body.innerHTML = '';

    // Контейнер для криптовалют
    const cryptoContainer = document.createElement('div');
    cryptoContainer.className = 'crypto-container';

    // Список криптовалют
    const cryptoList = document.createElement('div');
    cryptoList.className = 'crypto-list';

    this.cryptos.forEach(crypto => {
      const cryptoItem = document.createElement('div');
      cryptoItem.className = 'crypto-item';
      cryptoItem.dataset.cryptoId = crypto.id;
      
      const changeClass = parseFloat(crypto.change) >= 0 ? 'positive' : 'negative';
      const changeSign = parseFloat(crypto.change) >= 0 ? '+' : '';
      
      cryptoItem.innerHTML = `
        <div class="crypto-info">
          <div class="crypto-name">${crypto.name}</div>
          <div class="crypto-symbol">${crypto.symbol}</div>
        </div>
        <div class="crypto-price">$${crypto.price}</div>
        <div class="crypto-change ${changeClass}">${changeSign}${crypto.change}%</div>
      `;
      
      cryptoList.appendChild(cryptoItem);
    });

    // Кнопка обновления
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'crypto-refresh';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить цены';

    cryptoContainer.append(cryptoList, refreshBtn);
    this._body.append(cryptoContainer);

    // События
    const onRefresh = (e) => {
      e.preventDefault();
      this.updatePrices();
    };

    refreshBtn.addEventListener('click', onRefresh);
    this._listeners.push({ target: refreshBtn, type: 'click', handler: onRefresh });

    // запомним ссылки
    this._refs = { cryptoList };

    return root;
  }

  updatePrices() {
    // Обновляем цены случайным образом
    this.cryptos.forEach(crypto => {
      const change = (Math.random() * 10 - 5).toFixed(2);
      const currentPrice = parseFloat(crypto.price);
      const newPrice = (currentPrice * (1 + parseFloat(change) / 100)).toFixed(2);
      
      crypto.price = newPrice;
      crypto.change = change;
    });

    // Обновляем DOM
    if (this._refs && this._refs.cryptoList) {
      const items = this._refs.cryptoList.querySelectorAll('.crypto-item');
      
      items.forEach((item, index) => {
        const crypto = this.cryptos[index];
        const changeClass = parseFloat(crypto.change) >= 0 ? 'positive' : 'negative';
        const changeSign = parseFloat(crypto.change) >= 0 ? '+' : '';
        
        const priceEl = item.querySelector('.crypto-price');
        const changeEl = item.querySelector('.crypto-change');
        
        priceEl.textContent = `$${crypto.price}`;
        changeEl.textContent = `${changeSign}${crypto.change}%`;
        changeEl.className = `crypto-change ${changeClass}`;
      });
    }
  }

  // Переопределяем onDestroy чтобы очистить внутренние ссылки
  onDestroy() {
    this._refs = null;
  }
}