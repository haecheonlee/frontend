import { html } from "@/core/framework";
import { HourlyWeatherComponent } from "./HourlyWeatherComponent";

function WeatherComponent() {
    return html`<div class="weather-component">
        <div class="weather-component__daily-weather">
            <div class="daily-weather__city">
                <span>Montreal</span>
            </div>
            <div class="daily-weather__temperature">
                <span>25</span>
            </div>
            <div>
                <span>Sunny</span>
            </div>
            <div class="daily-weather__daily-temperature">
                <span class="daily-temperature__max">H: 28</span>
                <span class="daily-temperature__min">L: 17</span>
            </div>
        </div>
        <div class="weather-component__forecast">
            <div>${HourlyWeatherComponent()}</div>
            <div>${HourlyWeatherComponent()}</div>
            <div>${HourlyWeatherComponent()}</div>
            <div>${HourlyWeatherComponent()}</div>
            <div>${HourlyWeatherComponent()}</div>
        </div>
    </div>`;
}

export { WeatherComponent };
