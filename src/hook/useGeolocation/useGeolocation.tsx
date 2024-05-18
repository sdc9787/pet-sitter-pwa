import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string;
  error: string | null;
}

const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    city: "",
    error: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prevState) => ({
            ...prevState,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          setState((prevState) => ({
            ...prevState,
            error: "Error getting location",
          }));
          console.error("Error getting location:", error);
        }
      );
    } else {
      setState((prevState) => ({
        ...prevState,
        error: "Geolocation is not supported by this browser.",
      }));
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const { latitude, longitude } = state;
    if (latitude && longitude) {
      // Replace with your chosen API's endpoint and API key
      const API_KEY = "YOUR_API_KEY";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setState((prevState) => ({
            ...prevState,
            city: data.name,
          }));
        })
        .catch((error) => {
          setState((prevState) => ({
            ...prevState,
            error: "Error fetching city name",
          }));
          console.error("Error fetching city name:", error);
        });
    }
  }, [state.latitude, state.longitude]);

  return state;
};

export default useGeolocation;
