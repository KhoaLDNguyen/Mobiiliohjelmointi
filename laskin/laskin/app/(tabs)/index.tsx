import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

function toNumber(s: string) {
  const trimmed = s.trim();
  if (trimmed === "") return 0;
  const normalized = trimmed.replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

export default function CalculatorTwoInputs() {
  const [a, setA] = useState("0");
  const [b, setB] = useState("0");
  const [result, setResult] = useState<number>(35);

  const aNum = useMemo(() => toNumber(a), [a]);
  const bNum = useMemo(() => toNumber(b), [b]);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.result}>Result: {result}</Text>

        <TextInput
          value={a}
          onChangeText={setA}
          keyboardType="number-pad"
          style={styles.input}
          placeholder="First number"
        />
        <TextInput
          value={b}
          onChangeText={setB}
          keyboardType="number-pad"
          style={styles.input}
          placeholder="Second number"
        />

        <View style={styles.row}>
          <Pressable
            style={({ pressed }) => [styles.opBtn, pressed && styles.pressed]}
            onPress={() => setResult(aNum + bNum)}
          >
            <Text style={styles.opText}>+</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.opBtn, pressed && styles.pressed]}
            onPress={() => setResult(aNum - bNum)}
          >
            <Text style={styles.opText}>-</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  // "kortti" keskelle
  card: {
    width: 260,
    alignItems: "center",
  },

  result: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  // Inputit näyttää kuvassa aika "ohuilta"
  input: {
    width: 220,
    height: 36,
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    gap: 22,
    marginTop: 14,
  },

  // pienet siniset neliöt
  opBtn: {
    width: 42,
    height: 42,
    backgroundColor: "#1e88e5",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",

    // kevyt varjo (android + ios)
    elevation: 2,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  opText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 24,
  },
});
