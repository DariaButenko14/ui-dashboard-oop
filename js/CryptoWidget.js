import { UIComponent } from './UIComponent.js';

export class CryptoWidget extends UIComponent {
    #cryptoData;

    constructor(config = {}) {
        super({
            title: config.title || 'Криптовалюты',
            icon: 'fas fa-coins',
            id: config.id
        });
        
        this.#cryptoData = null;
        this.#fetchCryptoData();
    }

    async #fetchCryptoData() {
        try {
            // Используем CoinGecko API
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,polkadot&order=market_cap_desc&per_page=5&page=1&sparkline=false'
            );
            
            if (!response.ok) {
                throw new Error('Ошибка получения данных о криптовалютах');
            }
            
            const data = await response.json();
            this.#cryptoData = data.map(crypto => ({
                id: crypto.id,
                name: crypto.name,
                symbol: crypto.symbol.toUpperCase(),
                price: crypto.current_price,
                change24h: crypto.price_change_percentage_24h,
                image: crypto.image
            }));
            
            if (this.element) {
                this.update(this.render());
            }
        } catch (error) {
            console.error('Ошибка при получении данных о криптовалютах:', error);
            // Демо-данные
            this.#cryptoData = [
                { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 34000, change24h: 2.5 },
                { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 1800, change24h: 1.8 },
                { id: 'solana', name: 'Solana', symbol: 'SOL', price: 95, change24h: -0.5 },
                { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.35, change24h: 0.8 },
                { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 5.2, change24h: -1.2 }
            ];
            
            if (this.element) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error';
                errorDiv.textContent = 'Не удалось загрузить актуальные данные. Показаны демо-данные.';
                this.element.querySelector('.widget-content').prepend(errorDiv);
            }
        }
    }

    render() {
        if (!this.#cryptoData) {
            return '<div class="loading"><i class="fas fa-spinner"></i><p>Загрузка данных о криптовалютах...</p></div>';
        }

        return `
            <div class="crypto-container">
                <div class="crypto-grid">
                    ${this.#cryptoData.map(crypto => `
                        <div class="crypto-card" data-crypto="${crypto.id}">
                            <div class="crypto-name">${crypto.name} (${crypto.symbol})</div>
                            <div class="crypto-price">$${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            <div class="crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}">
                                ${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h.toFixed(2)}%
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="crypto-controls">
                    <small>Данные обновляются автоматически</small>
                    <button class="btn btn-secondary refresh-crypto">
                        <i class="fas fa-sync-alt"></i> Обновить
                    </button>
                </div>
            </div>
        `;
    }

    create() {
        const element = super.create();
        this.#setupEventListeners(element);
        return element;
    }

    #setupEventListeners(element) {
        const refreshBtn = element.querySelector('.refresh-crypto');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';
                refreshBtn.disabled = true;
                
                this.#fetchCryptoData().finally(() => {
                    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
                    refreshBtn.disabled = false;
                });
            });
        }
    }
}