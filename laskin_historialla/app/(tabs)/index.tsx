import { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";

export default function CalculatorWithHistory() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const plus = () => {
    const res = Number(a) + Number(b);
    setResult(res);
    setHistory([`${a} + ${b} = ${res}`, ...history]);
  };

  const minus = () => {
    const res = Number(a) - Number(b);
    setResult(res);
    setHistory([`${a} - ${b} = ${res}`, ...history]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.result}>Result: {result}</Text>

      <TextInput
        value={a}
        onChangeText={setA}
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput
        value={b}
        onChangeText={setB}
        keyboardType="number-pad"
        style={styles.input}
      />

      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={plus}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={minus}>
          <Text style={styles.btnText}>-</Text>
        </Pressable>
      </View>

      <Text style={styles.historyTitle}>History</Text>

      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.historyItem}>{item}</Text>}
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
  result: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    width: 220,
    height: 34,
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    gap: 22,
    marginTop: 10,
    marginBottom: 20,
  },
  btn: {
    width: 42,
    height: 42,
    backgroundColor: "#1e88e5",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  btnText: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  historyItem: {
    fontSize: 14,
    textAlign: "center",
  },
});
