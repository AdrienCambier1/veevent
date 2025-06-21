import { useState, useCallback } from "react";

interface GeolocationState {
  position: { latitude: number; longitude: number } | null;
  loading: boolean;
  error: string | null;
  supported: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  getCurrentPosition: () => Promise<{
    latitude: number;
    longitude: number;
  } | null>;
  clearError: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    loading: false,
    error: null,
    supported: typeof navigator !== "undefined" && "geolocation" in navigator,
  });

  const getCurrentPosition = useCallback((): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    return new Promise((resolve) => {
      if (!state.supported) {
        setState((prev) => ({
          ...prev,
          error: "Géolocalisation non supportée",
        }));
        resolve(null);
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setState((prev) => ({
            ...prev,
            position: coords,
            loading: false,
            error: null,
          }));

          resolve(coords);
        },
        (error) => {
          let errorMessage = "Erreur de géolocalisation";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permission de géolocalisation refusée";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Position indisponible";
              break;
            case error.TIMEOUT:
              errorMessage = "Délai de géolocalisation dépassé";
              break;
          }

          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));

          resolve(null);
        },
        options
      );
    });
  }, [state.supported]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    getCurrentPosition,
    clearError,
  };
}
