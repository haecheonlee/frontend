export enum ApiEndpoints {
    GET_WEATHER = "/weather?q={city}&appid={apiKey}&units=metric",
    GET_FORECAST = "/forecast?q={city}&appid={apiKey}&cnt={count}&units=metric",
}
