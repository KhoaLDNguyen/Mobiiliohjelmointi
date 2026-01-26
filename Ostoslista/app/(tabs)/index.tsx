import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ShoppingList() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState<string[]>([]);

  const addItem = () => {
    if (item.trim() === "") return;
    setItems([...items, item.trim()]);
    setItem("");
  };

  const clearAll = () => {
    setItems([]);
    setItem("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={item}
        onChangeText={setItem}
        placeholder=""
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Pressable style={styles.btn} onPress={addItem}>
          <Text style={styles.btnText}>ADD</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={clearAll}>
          <Text style={styles.btnText}>CLEAR</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Shopping List</Text>

      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: 220,
    height: 34,
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: 16,
  },
  btn: {
    width: 70,
    height: 34,
    backgroundColor: "#1e88e5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    elevation: 2,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  title: {
    color: "#1e88e5",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  list: {
    width: 220,
    maxHeight: 220,
  },
  listItem: {
    fontSize: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
