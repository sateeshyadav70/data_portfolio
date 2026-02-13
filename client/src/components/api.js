import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const mapOpenMeteoCodeToUiMode = (code, tempC) => {
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'winter';
  if ([95, 96, 99, 80, 81, 82, 61, 63, 65, 66, 67].includes(code)) return 'rainy';
  if (tempC <= 6) return 'winter';
  return 'sunny';
};

const getWeatherFromOpenMeteo = async ({ lat, lon }) => {
  const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,weather_code',
      timezone: 'auto',
    },
  });
  const current = response?.data?.current;
  if (!current) throw new Error('Open-Meteo response was invalid.');

  const tempC = Number.isFinite(current.temperature_2m) ? current.temperature_2m : null;
  const weatherCode = Number.isFinite(current.weather_code) ? current.weather_code : -1;
  const uiMode = mapOpenMeteoCodeToUiMode(weatherCode, tempC ?? 20);

  return {
    success: true,
    data: {
      uiMode,
      weatherMain: `code_${weatherCode}`,
      description: 'Live weather fallback',
      tempC,
      city: '',
      country: '',
      windMps: null,
    },
  };
};

export const submitContactForm = async (contactData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contact`, contactData);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    if (!error.response) {
      throw { success: false, message: 'Backend server is not reachable. Start server on port 5000.' };
    }
    throw error.response.data;
  }
};

export const getWeatherTheme = async ({ lat, lon }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/current`, {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    const status = error?.response?.status;
    if (!error.response || status === 404 || status === 405 || status >= 500) {
      try {
        return await getWeatherFromOpenMeteo({ lat, lon });
      } catch (fallbackError) {
        console.error('Open-Meteo fallback error:', fallbackError);
        throw { success: false, message: 'Could not fetch weather from server or fallback API.' };
      }
    }
    throw error.response.data;
  }
};
