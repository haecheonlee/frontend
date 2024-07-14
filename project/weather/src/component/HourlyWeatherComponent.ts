import { createElement, v } from "@/core/framework";

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
    return v(
        "div",
        { class: "hourly-weather-component" },
        v("div", {}, v("span", {}, time)),
        v(
            "div",
            { class: "hourly-weather-component__icon" },
            v("img", {
                alt: "hourly-weather-component-icon",
                src: `/images/${getWeatherSource(weatherDescription)}`,
            })
        ),
        v("div", {}, v("span", {}, String(temperature)))
    );
}

export { HourlyWeatherComponent };
