import { v } from "@/core/framework";

interface IHourlyWeatherComponentProps {
    time: string;
    temperature: number;
    main: WeatherMain;
}

const getWeatherSource = (main: WeatherMain) => {
    return main.toLowerCase().replaceAll(" ", "-").concat(".png");
};

function HourlyWeatherComponent({
    time,
    temperature,
    main,
}: IHourlyWeatherComponentProps) {
    return v(
        "div",
        { class: "hourly-weather-component" },
        v("div", {}, v("span", {}, time + " H")),
        v(
            "div",
            { class: "hourly-weather-component__icon" },
            v("img", {
                alt: "hourly-weather-component-icon",
                src: `/images/${getWeatherSource(main)}`,
            })
        ),
        v("div", {}, v("span", {}, String(temperature)))
    );
}

export { HourlyWeatherComponent };
