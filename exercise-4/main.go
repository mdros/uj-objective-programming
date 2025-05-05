package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

type ForecastResponse struct {
	Forecast string `json:"forecast"`
}

func getForecast(c echo.Context) error {
	err := godotenv.Load()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to load .env file"})
	}
	apiKey := os.Getenv("WEATHER_API_KEY")
	if apiKey == "" {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "API key not found in .env"})
	}

	location := c.QueryParam("q")
	if location == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Query parameter 'q' is required"})
	}

	apiURL := "https://api.weatherapi.com/v1/forecast.json"
	reqURL := apiURL + "?key=" + apiKey + "&q=" + location + "&days=5&aqi=no&alerts=no"

	resp, err := http.Get(reqURL)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch data from WeatherAPI"})
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "WeatherAPI returned an error"})
	}

	var apiResponse map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to parse WeatherAPI response"})
	}

	forecastData, ok := apiResponse["forecast"].(map[string]interface{})
	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid forecast data format"})
	}

	forecastDays, ok := forecastData["forecastday"].([]interface{})
	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid forecast days format"})
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

	apiResponse = map[string]interface{}{
		"forecast": result,
	}

	return c.JSON(http.StatusOK, apiResponse)
}

func main() {
	e := echo.New()
	e.GET("/forecast", getForecast)
	e.Logger.Fatal(e.Start(":1323"))
}
