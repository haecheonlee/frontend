import { html } from "@/core/framework";

function HourlyWeatherComponent() {
    return html`
        <div class="hourly-weather-component">
            <div>
                <span>Hour</span>
            </div>
            <div class="hourly-weather-component__icon">
                <span>Some Icon</span>
            </div>
            <div>
                <span>70</span>
            </div>
        </div>
    `;
}

export { HourlyWeatherComponent };
