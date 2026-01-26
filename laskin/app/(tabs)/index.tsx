import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Laskin() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.result}>Result: {result}</Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={a}
        onChangeText={setA}
        placeholder="First number"
      />

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={b}
        onChangeText={setB}
        placeholder="Second number"
      />

      <View style={styles.row}>
        <Pressable
          style={styles.button}
          onPress={() => setResult(Number(a) + Number(b))}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => setResult(Number(a) - Number(b))}
        >
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  result: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    backgroundColor: "blue",
    width: 40,
    height: 40,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});
