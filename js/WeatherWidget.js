// js/WeatherWidget.js
import UIComponent from './UIComponent.js';

export default class WeatherWidget extends UIComponent {
  constructor(config = {}) {
    super({ title: config.title || 'Погода', id: config.id });
    this.city = config.city || 'Moscow';
    this.weatherData = null;
    this._listenersLocal = [];
  }

  render() {
    const root = super.render();
    this._body.innerHTML = '';

    const weatherWrap = document.createElement('div');
    weatherWrap.className = 'weather-wrap';

    const cityEl = document.createElement('h4');
    cityEl.textContent = `Город: ${this.city}`;

    const tempEl = document.createElement('div');
    tempEl.className = 'weather-temp';
    tempEl.textContent = 'Температура: загрузка...';

    const descEl = document.createElement('div');
    descEl.className = 'weather-desc';
    descEl.textContent = 'Описание: загрузка...';

    const humidityEl = document.createElement('div');
    humidityEl.className = 'weather-humidity';
    humidityEl.textContent = 'Влажность: загрузка...';

    const btn = document.createElement('button');
    btn.className = 'weather-refresh';
    btn.textContent = 'Обновить';

    weatherWrap.append(cityEl, tempEl, descEl, humidityEl, btn);
    this._body.append(weatherWrap);

    const onRefresh = (e) => {
      this._fetchWeather();
    };

    btn.addEventListener('click', onRefresh);
    this._listeners.push({ target: btn, type: 'click', handler: onRefresh });

    // ссылки
    this._refs = { cityEl, tempEl, descEl, humidityEl, btn };

    // начальная загрузка
    this._fetchWeather();

    return root;
  }

  async _fetchWeather() {
    try {
      // В реальном проекте нужно использовать API ключ
      // const apiKey = 'ваш_api_ключ';
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${apiKey}&lang=ru`);
      
      // Демо-данные для примера
      await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки сети
      
      this.weatherData = {
        temp: Math.round(Math.random() * 30 - 5), // случайная температура от -5 до 25
        desc: ['ясно', 'облачно', 'дождь', 'снег'][Math.floor(Math.random() * 4)],
        humidity: Math.round(Math.random() * 100),
      };
      
      this._updateWeather();
    } catch (error) {
      console.error('Ошибка при получении погоды:', error);
      this._refs.tempEl.textContent = 'Ошибка загрузки';
      this._refs.descEl.textContent = 'Попробуйте обновить';
      this._refs.humidityEl.textContent = '';
    }
  }

  _updateWeather() {
    if (!this._refs) return;
    if (this.weatherData) {
      this._refs.tempEl.textContent = `Температура: ${this.weatherData.temp} °C`;
      this._refs.descEl.textContent = `Описание: ${this.weatherData.desc}`;
      this._refs.humidityEl.textContent = `Влажность: ${this.weatherData.humidity}%`;
    } else {
      this._refs.tempEl.textContent = 'Данные не загружены';
      this._refs.descEl.textContent = '';
      this._refs.humidityEl.textContent = '';
    }
  }

  onDestroy() {
    this._refs = null;
  }
}