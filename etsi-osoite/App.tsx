import { useEffect, useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

export default function App() {
  const [address, setAddress] = useState("Ratapihantie 13, Helsinki");
  const [loading, setLoading] = useState(false);

  const [region, setRegion] = useState<Region>({
    latitude: 60.1699, // fallback (Helsinki)
    longitude: 24.9384,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [marker, setMarker] = useState<{ lat: number; lon: number; title: string } | null>(null);

  // ✅ Kun appi avautuu: pyydä lupa + hae nykyinen sijainti
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Sijaintilupaa ei annettu.");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const lat = loc.coords.latitude;
        const lon = loc.coords.longitude;

        setRegion({
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } catch {
        Alert.alert("Error", "Sijainnin hakeminen epäonnistui.");
      }
    })();
  }, []);

  // ✅ SHOW: etsi osoite ja näytä marker kartalla
  const show = async () => {
    const q = address.trim();
    if (!q) return;

    try {
      setLoading(true);

      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
      const res = await fetch(geoUrl, { headers: { "User-Agent": "expo-app" } });

      if (!res.ok) {
        const txt = await res.text();
        Alert.alert("Geocode error", `${res.status}\n${txt.slice(0, 200)}`);
        return;
      }

      const data: NominatimResult[] = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        Alert.alert("Not found", "Address not found.");
        return;
      }

      const lat = Number(data[0].lat);
      const lon = Number(data[0].lon);

      if (!isFinite(lat) || !isFinite(lon)) {
        Alert.alert("Error", "Invalid coordinates.");
        return;
      }

      setMarker({ lat, lon, title: data[0].display_name });

      setRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch {
      Alert.alert("Error", "Failed to fetch coordinates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {marker && (
          <Marker
            coordinate={{ latitude: marker.lat, longitude: marker.lon }}
            title={marker.title}
          />
        )}
      </MapView>

      <View style={styles.bottom}>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          placeholder="Enter address"
        />

        <Pressable style={styles.btn} onPress={show} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>SHOW</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  bottom: { padding: 12, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#ddd" },
  input: { height: 40, borderWidth: 1, borderColor: "#999", paddingHorizontal: 10, marginBottom: 10 },
  btn: { height: 44, backgroundColor: "#1e88e5", alignItems: "center", justifyContent: "center", borderRadius: 2 },
  btnText: { color: "white", fontWeight: "700" },
});