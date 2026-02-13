const pickUiModeFromWeather = (weatherMain = "", tempC = null) => {
  const key = String(weatherMain).toLowerCase();

  if (["snow"].includes(key)) return "winter";
  if (["rain", "drizzle", "thunderstorm"].includes(key)) return "rainy";
  if (["clear", "clouds", "mist", "haze", "fog", "dust", "smoke"].includes(key)) {
    if (tempC !== null && tempC <= 6) return "winter";
    return "sunny";
  }

  return "sunny";
};

const getCurrentWeather = async (req, res) => {
  try {
    const lat = Number.parseFloat(req.query.lat);
    const lon = Number.parseFloat(req.query.lon);
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({
        success: false,
        message: "lat and lon query params are required",
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "OPENWEATHER_API_KEY is not configured",
      });
    }

    const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
    weatherUrl.searchParams.set("lat", lat.toString());
    weatherUrl.searchParams.set("lon", lon.toString());
    weatherUrl.searchParams.set("appid", apiKey);
    weatherUrl.searchParams.set("units", "metric");

    const response = await fetch(weatherUrl.toString());
    if (!response.ok) {
      const body = await response.text();
      return res.status(502).json({
        success: false,
        message: "OpenWeather request failed",
        detail: body.slice(0, 240),
      });
    }

    const payload = await response.json();
    const weatherMain = payload?.weather?.[0]?.main || "";
    const description = payload?.weather?.[0]?.description || "";
    const tempC = Number.isFinite(payload?.main?.temp) ? payload.main.temp : null;
    const uiMode = pickUiModeFromWeather(weatherMain, tempC);

    return res.status(200).json({
      success: true,
      data: {
        uiMode,
        weatherMain,
        description,
        tempC,
        city: payload?.name || "",
        country: payload?.sys?.country || "",
        windMps: Number.isFinite(payload?.wind?.speed) ? payload.wind.speed : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getCurrentWeather,
};
