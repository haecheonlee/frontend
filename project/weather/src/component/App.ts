import { createElement } from "@/core/framework";
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

            const response = await ApiService.get<ForecastResponse>(
                ApiEndpoints.GET_FORECAST,
                {
                    city: "Montreal",
                    count: "8",
                    apiKey: API_KEY,
                }
            );

            setForecast(response.data);
        }

        fetchForecast;
    }, [city]);

    return createElement(
        "div",
        { id: "main" },
        createElement(
            "div",
            { class: "search-box-container" },
            SearchComponent({
                onChangeCallback: setCity,
            })
        ),
        WeatherComponent()
    );
}

export { App };
