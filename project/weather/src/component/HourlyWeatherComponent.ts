import { createElement } from "@/core/framework";

function HourlyWeatherComponent() {
    return createElement(
        "div",
        { class: "hourly-weather-component" },
        createElement("div", {}, createElement("span", {}, "Hour")),
        createElement(
            "div",
            { class: "hourly-weather-component__icon" },
            createElement("img", {
                alt: "hourly-weather-component-icon",
                src: "/images/clear-sky.png",
            })
        ),
        createElement("div", {}, createElement("span", {}, "25"))
    );
}

export { HourlyWeatherComponent };
