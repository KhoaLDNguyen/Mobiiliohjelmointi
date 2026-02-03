import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Calculator">;

export default function CalculatorScreen({ navigation }: Props) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const plus = () => {
    if (a === "" || b === "") return;
    const res = Number(a) + Number(b);
    setResult(res);
    setHistory([`${a} + ${b} = ${res}`, ...history]);
  };

  const minus = () => {
    if (a === "" || b === "") return;
    const res = Number(a) - Number(b);
    setResult(res);
    setHistory([`${a} - ${b} = ${res}`, ...history]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.result}>Result: {result}</Text>

      <TextInput value={a} onChangeText={setA} keyboardType="number-pad" style={styles.input} />
      <TextInput value={b} onChangeText={setB} keyboardType="number-pad" style={styles.input} />

      <View style={styles.row}>
        <Pressable style={styles.smallBtn} onPress={plus}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>

        <Pressable style={styles.smallBtn} onPress={minus}>
          <Text style={styles.btnText}>-</Text>
        </Pressable>

        <Pressable
          style={styles.historyBtn}
          onPress={() => navigation.navigate("History", { history })}
        >
          <Text style={styles.historyText}>HISTORY</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white", padding: 20 },
  result: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  input: { width: 220, height: 34, borderWidth: 1, borderColor: "#999", paddingHorizontal: 8, marginBottom: 8 },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  smallBtn: { width: 38, height: 38, backgroundColor: "#1e88e5", alignItems: "center", justifyContent: "center", borderRadius: 2 },
  btnText: { color: "white", fontSize: 20, fontWeight: "700" },
  historyBtn: { height: 38, paddingHorizontal: 14, backgroundColor: "#1e88e5", alignItems: "center", justifyContent: "center", borderRadius: 2 },
  historyText: { color: "white", fontSize: 12, fontWeight: "700" },
});
