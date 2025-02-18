import { useEffect, useState } from "react";
import * as Location from "expo-location";
const useLocation = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [coords, setCoords] = useState<{latitude : number, longitude: number} | null>(null);
  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setError("Permission to access location was denied");
      return;
    }

    try {
      setLoading(true);
      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (coords) {
        setCoords(coords);
        let response = await Location.reverseGeocodeAsync(coords);
        console.log(
          "User Location is ",
          response[0].formattedAddress.split(",")[1]
        );

        setLocation(response[0].formattedAddress.split(",")[1]);
      }
    } catch (error) {
      console.error("Error getting location", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return { location, error, loading, coords };
};

export default useLocation;
