import { UIComponent } from './UIComponent.js';

export class QuoteWidget extends UIComponent {
    #currentQuote;

    constructor(config = {}) {
        super({
            title: config.title || 'Цитата дня',
            icon: 'fas fa-quote-right',
            id: config.id
        });
        
        this.#currentQuote = config.quote || null;
        this.#fetchRandomQuote();
    }

    async #fetchRandomQuote() {
        try {
            // API для получения случайных цитат
            const response = await fetch('https://api.quotable.io/random');
            const data = await response.json();
            this.#currentQuote = {
                text: data.content,
                author: data.author
            };
            
            // Если виджет уже создан, обновляем его
            if (this.element) {
                this.update(this.render());
            }
        } catch (error) {
            console.error('Ошибка при получении цитаты:', error);
            // Резервная цитата
            this.#currentQuote = {
                text: 'Код — это поэзия, написанная для машин.',
                author: 'Анонимный программист'
            };
        }
    }

    render() {
        if (!this.#currentQuote) {
            return '<div class="loading"><i class="fas fa-spinner"></i><p>Загрузка цитаты...</p></div>';
        }

        return `
            <div class="quote-content">
                <div class="quote-text">"${this.#currentQuote.text}"</div>
                <div class="quote-author">— ${this.#currentQuote.author}</div>
                <div class="quote-controls">
                    <button class="btn btn-primary refresh-quote">
                        <i class="fas fa-sync-alt"></i> Новая цитата
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
        const refreshBtn = element.querySelector('.refresh-quote');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
                refreshBtn.disabled = true;
                
                this.#fetchRandomQuote().finally(() => {
                    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Новая цитата';
                    refreshBtn.disabled = false;
                });
            });
        }
    }
}