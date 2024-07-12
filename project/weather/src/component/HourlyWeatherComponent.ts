import { createElement } from "@/core/framework";

interface IHourlyWeatherComponentProps {
    time: string;
    temperature: number;
    weatherDescription: WeatherDescription;
}

const getWeatherSource = (description: WeatherDescription) => {
    return description.replaceAll(" ", "-").concat(".png");
};

function HourlyWeatherComponent({
    time,
    temperature,
    weatherDescription,
}: IHourlyWeatherComponentProps) {
    return createElement(
        "div",
        { class: "hourly-weather-component" },
        createElement("div", {}, createElement("span", {}, time)),
        createElement(
            "div",
            { class: "hourly-weather-component__icon" },
            createElement("img", {
                alt: "hourly-weather-component-icon",
                src: `/images/${getWeatherSource(weatherDescription)}`,
            })
        ),
        createElement("div", {}, createElement("span", {}, String(temperature)))
    );
}

export { HourlyWeatherComponent };
