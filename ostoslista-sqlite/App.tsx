import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import * as SQLite from "expo-sqlite";

type Item = {
  id: number;
  product: string;
  amount: string;
};

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const init = async () => {
      const database = await SQLite.openDatabaseAsync("shoppingdb.db");
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS shopping (
          id INTEGER PRIMARY KEY NOT NULL,
          product TEXT NOT NULL,
          amount TEXT NOT NULL
        );
      `);

      loadItems(database);
    };

    init();
  }, []);

  const loadItems = async (databaseParam?: SQLite.SQLiteDatabase) => {
    const database = databaseParam || db;
    if (!database) return;

    const result = await database.getAllAsync<Item>(
      "SELECT * FROM shopping"
    );

    setItems(result);
  };

  const saveItem = async () => {
    if (!db) return;
    if (product.trim() === "" || amount.trim() === "") return;

    await db.runAsync(
      "INSERT INTO shopping (product, amount) VALUES (?, ?)",
      [product, amount]
    );

    setProduct("");
    setAmount("");
    loadItems();
  };

  const deleteItem = async (id: number) => {
    if (!db) return;

    await db.runAsync("DELETE FROM shopping WHERE id = ?", [id]);
    loadItems();
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={product}
        onChangeText={setProduct}
        placeholder="Product"
        style={styles.input}
      />

      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={saveItem}>
        <Text style={styles.buttonText}>SAVE</Text>
      </Pressable>

      <Text style={styles.title}>Shopping list</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.itemText}>
              {item.product}, {item.amount}
            </Text>
            <Pressable onPress={() => deleteItem(item.id)}>
              <Text style={styles.link}>bought</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#999",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#1e88e5",
    width: 70,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 20,
    borderRadius: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "center",
    gap: 8,
  },
  itemText: {
    fontSize: 14,
  },
  link: {
    color: "blue",
    fontSize: 14,
  },
});