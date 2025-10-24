import UIComponent from './UIComponent.js';

export default class WeatherWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.state = { status: 'init', temp: null, city: null, error: null };
  }

  async fetchWeather(lat, lon) {
    // Простая текущая температура
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return data?.current?.temperature_2m;
  }

  async getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Геолокация недоступна'));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    });
  }

  async render() {
    const { wrapper, body } = this._createBase();

    body.innerHTML = `
      <div class="weather">
        <p class="status">Определяю местоположение…</p>
        <p class="temp"></p>
        <div class="controls">
          <button class="refresh">Обновить</button>
        </div>
      </div>
    `;

    const statusEl = body.querySelector('.status');
    const tempEl = body.querySelector('.temp');
    const btn = body.querySelector('.refresh');

    const updateUI = () => {
      if (this.state.status === 'loading') {
        statusEl.textContent = 'Загрузка погоды…';
        tempEl.textContent = '';
      } else if (this.state.status === 'ready') {
        statusEl.textContent = this.state.city ? `Ваше местоположение` : 'Текущая погода';
        tempEl.textContent = `Температура: ${this.state.temp} °C`;
      } else if (this.state.status === 'error') {
        statusEl.textContent = 'Ошибка: ' + this.state.error;
        tempEl.textContent = '';
      }
    };

    const onRefresh = async () => {
      btn.disabled = true;
      this.state.status = 'loading';
      updateUI();
      try {
        // Получаем координаты
        const { lat, lon } = await this.getLocation();
        // Забираем температуру
        const temp = await this.fetchWeather(lat, lon);
        this.state = { status: 'ready', temp, city: null, error: null };
      } catch (e) {
        this.state = { status: 'error', temp: null, city: null, error: e.message || 'неизвестно' };
      }
      updateUI();
      btn.disabled = false;
    };

    btn.addEventListener('click', onRefresh);
    this._handlers.push({ target: btn, type: 'click', fn: onRefresh });

    // первичная загрузка
    onRefresh();

    this.element = wrapper;
    return wrapper;
  }
}
