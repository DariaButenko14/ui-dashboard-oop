import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
    #city;
    #weatherData;

    constructor(config = {}) {
        super({
            title: config.title || 'Погода',
            icon: 'fas fa-cloud-sun',
            id: config.id
        });
        
        this.#city = config.city || 'Moscow';
        this.#weatherData = null;
        this.#fetchWeather();
    }

    async #fetchWeather() {
        try {
            // Используем OpenWeatherMap API (нужно заменить API_KEY на свой)
            const API_KEY = 'ваш_api_ключ'; // Зарегистрируйтесь на openweathermap.org для получения ключа
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${this.#city}&units=metric&appid=${API_KEY}&lang=ru`
            );
            
            if (!response.ok) {
                throw new Error('Ошибка получения данных о погоде');
            }
            
            const data = await response.json();
            this.#weatherData = {
                temp: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind.speed,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                city: data.name,
                country: data.sys.country
            };
            
            if (this.element) {
                this.update(this.render());
            }
        } catch (error) {
            console.error('Ошибка при получении погоды:', error);
            this.#weatherData = {
                temp: 20,
                feelsLike: 19,
                humidity: 65,
                pressure: 1013,
                windSpeed: 3,
                description: 'ясно',
                icon: '01d',
                city: this.#city,
                country: 'RU'
            };
            
            if (this.element) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error';
                errorDiv.textContent = 'Не удалось загрузить актуальные данные. Показаны демо-данные.';
                this.element.querySelector('.widget-content').prepend(errorDiv);
            }
        }
    }

    #getWeatherIcon(iconCode) {
        const icons = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-showers-heavy',
            '10n': 'fas fa-cloud-showers-heavy',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };
        
        return icons[iconCode] || 'fas fa-question-circle';
    }

    render() {
        if (!this.#weatherData) {
            return '<div class="loading"><i class="fas fa-spinner"></i><p>Загрузка погоды...</p></div>';
        }

        const weather = this.#weatherData;
        
        return `
            <div class="weather-container">
                <div class="weather-info">
                    <div class="weather-icon">
                        <i class="${this.#getWeatherIcon(weather.icon)}"></i>
                    </div>
                    <div class="weather-main">
                        <div class="weather-temp">${weather.temp}°C</div>
                        <div class="weather-description">${weather.description}</div>
                        <div class="weather-city">${weather.city}, ${weather.country}</div>
                    </div>
                </div>
                
                <div class="weather-details">
                    <div class="weather-detail">
                        <div class="detail-label">Ощущается как</div>
                        <div class="detail-value">${weather.feelsLike}°C</div>
                    </div>
                    <div class="weather-detail">
                        <div class="detail-label">Влажность</div>
                        <div class="detail-value">${weather.humidity}%</div>
                    </div>
                    <div class="weather-detail">
                        <div class="detail-label">Давление</div>
                        <div class="detail-value">${weather.pressure} гПа</div>
                    </div>
                    <div class="weather-detail">
                        <div class="detail-label">Ветер</div>
                        <div class="detail-value">${weather.windSpeed} м/с</div>
                    </div>
                </div>
                
                <div class="weather-controls">
                    <button class="btn btn-secondary refresh-weather">
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
        const refreshBtn = element.querySelector('.refresh-weather');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';
                refreshBtn.disabled = true;
                
                this.#fetchWeather().finally(() => {
                    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
                    refreshBtn.disabled = false;
                });
            });
        }
    }
}