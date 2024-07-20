import { v } from "@/core/framework";
import { SearchComponent } from "./SearchComponent";
import { WeatherComponent } from "./WeatherComponent";
import { useEffect, useState } from "@/core/hook";
import { ApiEndpoints } from "@/api/endpoint";
import { ApiService } from "@/api/service";
import { API_KEY } from "@/api/config";

function App() {
    const [city, setCity] = useState("");
    const [forecast, setForecast] = useState<ForecastResponse | null>(null);

    useEffect(() => {
        async function fetchForecast() {
            if (!API_KEY) {
                throw new Error("The api key is not provided.");
            }

            if (!city) {
                return;
            }

            const response = await ApiService.get<ForecastResponse>(
                ApiEndpoints.GET_FORECAST.url,
                {
                    city,
                    count: "5",
                    apiKey: API_KEY,
                }
            );

            setForecast(response.data);
        }

        fetchForecast();
    }, [city]);

    return v(
        "div",
        {
            id: "main",
            class:
                "weather " +
                (forecast?.list[0].weather[0].main
                    ? forecast.list[0].weather[0].main.toLowerCase()
                    : "none"),
        },
        v(
            "div",
            { id: "container" },
            v(
                "div",
                { class: "search-box-container" },
                SearchComponent({
                    value: city,
                    onChangeCallback: setCity,
                })
            ),
            forecast
                ? WeatherComponent({
                      city: forecast.city,
                      weatherData: forecast.list ?? [],
                  })
                : null
        )
    );
}

export { App };
