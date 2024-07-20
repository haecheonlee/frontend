import { v } from "@/core/framework";
import { HourlyWeatherComponent } from "./HourlyWeatherComponent";

interface IWeatherComponentProps {
    city: City;
    weatherData: WeatherData[];
}

function WeatherComponent({ city, weatherData }: IWeatherComponentProps) {
    const currentWeather = weatherData[0];

    if (!currentWeather) {
        return null;
    }

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

    return v(
        "div",
        { class: "weather-component" },
        v(
            "div",
            { class: "weather-component__daily-weather" },
            v(
                "div",
                { class: "daily-weather__city" },
                v("span", {}, city.name)
            ),
            v(
                "div",
                { class: "daily-weather__temperature" },
                v("span", {}, String(currentWeather.main.temp)),
                v("sup", {}, "°")
            ),
            v(
                "span",
                { class: "daily-weather__daily-main" },
                currentWeather.weather[0]?.main ?? ""
            ),
            v(
                "div",
                { class: "daily-weather__daily-temperature" },
                v(
                    "span",
                    { class: "daily-temperature__max" },
                    `H: ${maxTemperature}`,
                    v("sup", {}, "°")
                ),
                v(
                    "span",
                    { class: "daily-temperature__min" },
                    `L: ${minTemperature}`,
                    v("sup", {}, "°")
                )
            )
        ),
        v(
            "div",
            { class: "weather-component__forecast" },
            ...weatherData.map((weather) => {
                return v(
                    "div",
                    {},
                    HourlyWeatherComponent({
                        time: new Date(weather.dt * 1000 + city.timezone * 1000)
                            .getHours()
                            .toString(),
                        temperature: weather.main.temp,
                        main: weather.weather[0].main,
                    })
                );
            })
        )
    );
}

export { WeatherComponent };
