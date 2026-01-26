import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";

export default function NumberGuess() {
  const [number] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("Guess a number between 1-100");

  const makeGuess = () => {
    const g = Number(guess);
    const newCount = count + 1;
    setCount(newCount);

    if (g < number) {
      setMessage(`Your guess ${g} is too low`);
    } else if (g > number) {
      setMessage(`Your guess ${g} is too high`);
    } else {
      Alert.alert(
        "Correct",
        `You guessed the number in ${newCount} guesses`,
        [{ text: "OK" }]
      );
      return; // ⬅️ TÄRKEÄ: estää jatkon
    }

    setGuess("");
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ marginBottom: 10 }}>{message}</Text>

      <TextInput
        value={guess}
        onChangeText={setGuess}
        keyboardType="number-pad"
        style={{
          width: 80,
          borderWidth: 1,
          padding: 5,
          marginBottom: 10,
          textAlign: "center",
        }}
      />

      <Pressable
        onPress={makeGuess}
        style={{ backgroundColor: "blue", padding: 10 }}
      >
        <Text style={{ color: "white" }}>MAKE GUESS</Text>
      </Pressable>
    </View>
  );
}
