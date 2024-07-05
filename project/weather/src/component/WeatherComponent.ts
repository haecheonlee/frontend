import { createElement } from "@/core/framework";
import { HourlyWeatherComponent } from "./HourlyWeatherComponent";

function WeatherComponent() {
    return createElement(
        "div",
        { class: "weather-component" },
        createElement(
            "div",
            { class: "weather-component__daily-weather" },
            createElement(
                "div",
                { class: "daily-weather__city" },
                createElement("span", {}, "Montreal")
            ),
            createElement(
                "div",
                { class: "daily-weather__temperature" },
                createElement("span", {}, "25")
            ),
            createElement("span", {}, "Sunny"),
            createElement(
                "div",
                { class: "daily-weather__daily-temperature" },
                createElement(
                    "span",
                    { class: "daily-temperature__max" },
                    "H: 28"
                ),
                createElement(
                    "span",
                    { class: "daily-temperature__min" },
                    "L: 17"
                )
            )
        ),
        createElement(
            "div",
            { class: "weather-component__forecast" },
            createElement("div", {}, HourlyWeatherComponent()),
            createElement("div", {}, HourlyWeatherComponent()),
            createElement("div", {}, HourlyWeatherComponent()),
            createElement("div", {}, HourlyWeatherComponent()),
            createElement("div", {}, HourlyWeatherComponent())
        )
    );
}

export { WeatherComponent };
