import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

type GeoResult = {
  lat: string;
  lon: string;
  display_name: string;
};

export default function App() {
  const [address, setAddress] = useState("Ratapihantie 13, Helsinki");
  const [loading, setLoading] = useState(false);

  const [region, setRegion] = useState<Region>({
    latitude: 60.171,
    longitude: 24.941,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [marker, setMarker] = useState<{ lat: number; lon: number; title: string } | null>(null);

  const show = async () => {
    const q = address.trim();
    if (!q) return;

    try {
      setLoading(true);

      const url = `https://geocode.maps.co/search?q=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data: GeoResult[] = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        Alert.alert("Not found", "Address not found.");
        return;
      }

      const first = data[0];
      const lat = Number(first.lat);
      const lon = Number(first.lon);

      if (!isFinite(lat) || !isFinite(lon)) {
        Alert.alert("Error", "Invalid coordinates.");
        return;
      }

      setMarker({ lat, lon, title: first.display_name });

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
          <Marker coordinate={{ latitude: marker.lat, longitude: marker.lon }} title={marker.title} />
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