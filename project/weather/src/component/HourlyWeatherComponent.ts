import { createElement } from "@/core/framework";

interface IHourlyWeatherComponentProps {
    time: string;
    temperature: number;
}

function HourlyWeatherComponent({
    time,
    temperature,
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
                src: "/images/clear-sky.png",
            })
        ),
        createElement("div", {}, createElement("span", {}, String(temperature)))
    );
}

export { HourlyWeatherComponent };
