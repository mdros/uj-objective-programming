package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

type ForecastResponse struct {
	Forecast string `json:"forecast"`
}

func getForecast(c echo.Context) error {
	if err := godotenv.Load(); err != nil {
		return respondWithError(c, http.StatusInternalServerError, "Failed to load .env file")
	}

	apiKey := os.Getenv("WEATHER_API_KEY")
	if apiKey == "" {
		return respondWithError(c, http.StatusInternalServerError, "API key not found in .env")
	}

	location := c.QueryParam("q")
	if location == "" {
		return respondWithError(c, http.StatusBadRequest, "Query parameter 'q' is required")
	}

	apiResponse, err := fetchWeatherData(apiKey, location)
	if err != nil {
		return respondWithError(c, http.StatusInternalServerError, err.Error())
	}

	forecast, err := parseForecast(apiResponse)
	if err != nil {
		return respondWithError(c, http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]interface{}{"forecast": forecast})
}

func respondWithError(c echo.Context, status int, message string) error {
	return c.JSON(status, map[string]string{"error": message})
}

func fetchWeatherData(apiKey, location string) (map[string]interface{}, error) {
	apiURL := "https://api.weatherapi.com/v1/forecast.json"
	reqURL := apiURL + "?key=" + apiKey + "&q=" + location + "&days=5&aqi=no&alerts=no"

	resp, err := http.Get(reqURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("WeatherAPI returned an error")
	}

	var apiResponse map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, fmt.Errorf("failed to parse WeatherAPI response")
	}

	return apiResponse, nil
}

func parseForecast(apiResponse map[string]interface{}) ([]map[string]interface{}, error) {
	forecastData, ok := apiResponse["forecast"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid forecast data format")
	}

	forecastDays, ok := forecastData["forecastday"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid forecast days format")
	}

	var result []map[string]interface{}
	for _, day := range forecastDays {
		dayData, ok := day.(map[string]interface{})
		if !ok {
			continue
		}

		date, _ := dayData["date"].(string)
		dayDetails, ok := dayData["day"].(map[string]interface{})
		if !ok {
			continue
		}

		mintempC, _ := dayDetails["mintemp_c"].(float64)
		maxtempC, _ := dayDetails["maxtemp_c"].(float64)
		chanceOfRain, _ := dayDetails["daily_chance_of_rain"].(float64)

		result = append(result, map[string]interface{}{
			"date":                 date,
			"mintemp_c":            mintempC,
			"maxtemp_c":            maxtempC,
			"daily_chance_of_rain": chanceOfRain,
		})
	}

	return result, nil
}

func main() {
	e := echo.New()
	e.GET("/forecast", getForecast)
	e.Logger.Fatal(e.Start(":1323"))
}
