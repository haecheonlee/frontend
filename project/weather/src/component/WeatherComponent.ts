import { createElement } from "@/core/framework";
import { HourlyWeatherComponent } from "./HourlyWeatherComponent";

interface IWeatherComponentProps {
    city: City;
    weatherData: WeatherData[];
}

function WeatherComponent({ city, weatherData }: IWeatherComponentProps) {
    const currentWeather = weatherData.find((weather, index) => {
        const now = new Date();
        return (
            new Date(weather.dt_txt) <= now &&
            now < new Date(weatherData[index + 1]?.dt_txt)
        );
    })!;
    const maxTemperature = weatherData.reduce<number | null>(
        (temperature, weather) => {
            if (temperature == null) {
                return weather.main.temp_max;
            }

            return Math.max(temperature, weather.main.temp_max);
        },
        null
    );
    const minTemperature = weatherData.reduce<number | null>(
        (temperature, weather) => {
            if (temperature == null) {
                return weather.main.temp_min;
            }

            return Math.min(temperature, weather.main.temp_max);
        },
        null
    );

    return createElement(
        "div",
        { class: "weather-component" },
        createElement(
            "div",
            { class: "weather-component__daily-weather" },
            createElement(
                "div",
                { class: "daily-weather__city" },
                createElement("span", {}, city.name)
            ),
            createElement(
                "div",
                { class: "daily-weather__temperature" },
                createElement("span", {}, String(currentWeather.main.temp))
            ),
            createElement("span", {}, currentWeather.weather[0]?.main ?? ""),
            createElement(
                "div",
                { class: "daily-weather__daily-temperature" },
                createElement(
                    "span",
                    { class: "daily-temperature__max" },
                    `{H: ${maxTemperature}`
                ),
                createElement(
                    "span",
                    { class: "daily-temperature__min" },
                    `L: ${minTemperature}`
                )
            )
        ),
        createElement(
            "div",
            { class: "weather-component__forecast" },
            ...Array.from({ length: 5 }).map((_, index) => {
                const weather = weatherData[index * 2];

                return createElement(
                    "div",
                    {},
                    HourlyWeatherComponent({
                        time: new Date(weather.dt_txt).getTime().toString(),
                        temperature: weather.main.temp,
                        weatherDescription: weather.weather[0].description,
                    })
                );
            })
        )
    );
}

export { WeatherComponent };
