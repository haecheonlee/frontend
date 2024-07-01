import { html } from "@/core/framework";

function HourlyWeatherComponent() {
    return html`
        <div class="hourly-weather-component">
            <div>
                <span>Hour</span>
            </div>
            <div class="hourly-weather-component__icon">
                <img
                    alt="hourly-weather-component-icon"
                    src="/images/clear-sky.png"
                />
            </div>
            <div>
                <span>25</span>
            </div>
        </div>
    `;
}

export { HourlyWeatherComponent };
