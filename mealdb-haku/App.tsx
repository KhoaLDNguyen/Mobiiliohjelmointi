import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export default function App() {
  const [ingredient, setIngredient] = useState("tomato");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMeals = async () => {
    const q = ingredient.trim();
    if (!q) return;

    try {
      setLoading(true);
      const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
        q
      )}`;
      const res = await fetch(url);
      const data = await res.json();

      // MealDB palauttaa { meals: null } jos ei tuloksia
      setMeals(data.meals ?? []);
      if (data.meals === null) {
        Alert.alert("No results", `No meals found for "${q}"`);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={ingredient}
        onChangeText={setIngredient}
        placeholder="ingredient (e.g. tomato)"
        style={styles.input}
        autoCapitalize="none"
      />

      <Pressable style={styles.btn} onPress={fetchMeals}>
        <Text style={styles.btnText}>FIND</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : (
        <FlatList
          style={styles.list}
          data={meals}
          keyExtractor={(item) => item.idMeal}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.title}>{item.strMeal}</Text>
              <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    height: 36,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  btn: {
    height: 36,
    backgroundColor: "#1e88e5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    marginBottom: 12,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  list: {
    marginTop: 6,
  },
  row: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 6,
  },
  thumb: {
    width: 70,
    height: 70,
    borderRadius: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#e6e6e6",
  },
});
