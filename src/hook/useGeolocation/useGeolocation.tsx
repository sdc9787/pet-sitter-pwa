import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string;
  district: string;
  road: string;
  error: string | null;
}

const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    city: "",
    district: "",
    road: "",
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
      const API_KEY = `${import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY}`;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            const result = data.results[0];
            const addressComponents = result.address_components;

            let city = "";
            let district = "";
            let road = "";

            addressComponents.reverse().forEach((component: any) => {
              console.log("Component:", component);
              if (component.types.includes("administrative_area_level_1")) {
                city = component.long_name;
              }
              if (component.types.includes("locality")) {
                district = component.long_name;
              }
              if (component.types.includes("sublocality_level_4")) {
                road = component.long_name;
              }
              if (component.types.includes("premise")) {
                road += " " + component.long_name;
              }
            });

            setState((prevState) => ({
              ...prevState,
              city: city,
              district: district,
              road: road,
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              error: "Error fetching address",
            }));
            console.error("Error fetching address:", data.status);
          }
        })
        .catch((error) => {
          setState((prevState) => ({
            ...prevState,
            error: "Error fetching address",
          }));
          console.error("Error fetching address:", error);
        });
    }
  }, [state.latitude, state.longitude]);

  return state;
};

export default useGeolocation;
