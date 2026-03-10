import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "firebase/database";

type Item = {
  id: string;
  product: string;
  amount: string;
};

const firebaseConfig = {
  apiKey: "AIzaSyBTAzXdWHWgRKNbwZrHKwShZKKHEpv1ku4",
  authDomain: "ostoslista-bfe2f.firebaseapp.com",
  projectId: "ostoslista-bfe2f",
  storageBucket: "ostoslista-bfe2f.firebasestorage.app",
  messagingSenderId: "480150592425",
  appId: "1:480150592425:web:f5c6f0c9c5ddb6d77702b8",
  measurementId: "G-R6S63WTDXP"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const shoppingRef = ref(db, "shoppinglist");

    const unsubscribe = onValue(shoppingRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setItems([]);
        return;
      }

      const loadedItems: Item[] = Object.keys(data).map((key) => ({
        id: key,
        product: data[key].product,
        amount: data[key].amount,
      }));

      setItems(loadedItems);
    });

    return () => unsubscribe();
  }, []);

  const saveItem = async () => {
    if (product.trim() === "" || amount.trim() === "") return;

    const shoppingRef = ref(db, "shoppinglist");

    await push(shoppingRef, {
      product: product.trim(),
      amount: amount.trim(),
    });

    setProduct("");
    setAmount("");
  };

  const deleteItem = async (id: string) => {
    const itemRef = ref(db, `shoppinglist/${id}`);
    await remove(itemRef);
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.itemText}>
              {item.product}, {item.amount}
            </Text>
            <Pressable onPress={() => deleteItem(item.id)}>
              <Text style={styles.link}>delete</Text>
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
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
  },
  link: {
    color: "blue",
    fontSize: 14,
  },
});