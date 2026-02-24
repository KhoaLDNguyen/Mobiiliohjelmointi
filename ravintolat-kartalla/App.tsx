import { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

const GOOGLE_API_KEY = "AIzaSyCQZDaD2jPV-qmfJIUY7E4daQoG8IFy-jg";

type GeocodeResponse = {
  status: string;
  results: Array<{
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
  }>;
  error_message?: string;
};

type PlacesResponse = {
  status: string;
  results: Array<{
    place_id: string;
    name: string;
    vicinity?: string; // usein osoite/alue
    geometry: { location: { lat: number; lng: number } };
  }>;
  error_message?: string;
};

export default function App() {
  const [address, setAddress] = useState("Mikonkatu 10, Helsinki");
  const [loading, setLoading] = useState(false);

  const [region, setRegion] = useState<Region>({
    latitude: 60.1699,
    longitude: 24.9384,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
  });

  const [restaurants, setRestaurants] = useState<
    { id: string; lat: number; lon: number; title: string }[]
  >([]);

  const show = async () => {
    const q = address.trim();
    if (!q) return;

    if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes("PASTA_")) {
      Alert.alert("API key puuttuu", "Lisää GOOGLE_API_KEY App.tsx:ään.");
      return;
    }

    try {
      setLoading(true);
      setRestaurants([]);

      // 1) Geocoding: address -> lat/lng
      const geoUrl =
        `https://maps.googleapis.com/maps/api/geocode/json?address=` +
        `${encodeURIComponent(q)}&key=${encodeURIComponent(GOOGLE_API_KEY)}`;

      const geoRes = await fetch(geoUrl);
      const geoData: GeocodeResponse = await geoRes.json();

      if (geoData.status !== "OK" || geoData.results.length === 0) {
        Alert.alert(
          "Geocoding error",
          geoData.error_message ?? `Status: ${geoData.status}`
        );
        return;
      }

      const loc = geoData.results[0].geometry.location;
      const lat = loc.lat;
      const lon = loc.lng;

      setRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      // 2) Places Nearby Search: restaurants near location
      const radius = 1500;

      const placesUrl =
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=` +
        `${lat},${lon}&radius=${radius}&type=restaurant&key=${encodeURIComponent(
          GOOGLE_API_KEY
        )}`;

      const placesRes = await fetch(placesUrl);
      const placesData: PlacesResponse = await placesRes.json();

      if (placesData.status !== "OK" && placesData.status !== "ZERO_RESULTS") {
        Alert.alert(
          "Places error",
          placesData.error_message ?? `Status: ${placesData.status}`
        );
        return;
      }

      const list =
        placesData.results?.map((p) => {
          const rLat = p.geometry.location.lat;
          const rLon = p.geometry.location.lng;

          const addr = p.vicinity ? ` — ${p.vicinity}` : "";
          return {
            id: p.place_id,
            lat: rLat,
            lon: rLon,
            title: `${p.name}${addr}`,
          };
        }) ?? [];

      if (list.length === 0) {
        Alert.alert("No results", "No restaurants found nearby.");
      }

      setRestaurants(list);
    } catch (e: any) {
      Alert.alert("Error", String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {restaurants.map((r) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.lat, longitude: r.lon }}
            title={r.title}
          />
        ))}
      </MapView>

      <View style={styles.bottom}>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          placeholder="Enter address"
          autoCapitalize="none"
        />

        <Pressable style={styles.btn} onPress={show} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>SHOW</Text>}
        </Pressable>

        <Text style={styles.small}>Found: {restaurants.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  bottom: {
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  btn: {
    height: 44,
    backgroundColor: "#1e88e5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  btnText: { color: "white", fontWeight: "700" },
  small: { marginTop: 8, fontSize: 12, color: "#666" },
});