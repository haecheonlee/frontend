// types/openweathermap.d.ts

/**
 * The main response from the OpenWeatherMap forecast API.
 */
interface ForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: WeatherData[];
    city: City;
}

/**
 * Represents the weather data for a specific time.
 */
interface WeatherData {
    dt: number;
    main: Main;
    weather: Weather[];
    clouds: Clouds;
    wind: Wind;
    visibility: number;
    pop: number;
    rain?: Precipitation;
    snow?: Precipitation;
    sys: Sys;
    dt_txt: string;
}

/**
 * Main weather information.
 */
interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

/**
 * The description of weather.
 */
type WeatherDescription =
    | "clear sky"
    | "few clouds"
    | "scattered clouds"
    | "broken clouds"
    | "shower rain"
    | "rain"
    | "thunderstorm"
    | "snow"
    | "mist";

/**
 * Weather conditions.
 */
interface Weather {
    id: number;
    main: string;
    description: WeatherDescription;
    icon: string;
}

/**
 * Cloudiness information.
 */
interface Clouds {
    all: number;
}

/**
 * Wind information.
 */
interface Wind {
    speed: number;
    deg: number;
    gust?: number;
}

/**
 * Precipitation information.
 */
interface Precipitation {
    "1h"?: number;
    "3h"?: number;
}

/**
 * System information.
 */
interface Sys {
    pod: string;
}

/**
 * City information.
 */
interface City {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}

/**
 * Geographic coordinates.
 */
interface Coordinates {
    lat: number;
    lon: number;
}
