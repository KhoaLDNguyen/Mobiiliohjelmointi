import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import * as Speech from "expo-speech";

export default function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");

  const speak = () => {
    if (text.trim() === "") return;

    Speech.speak(text, {
      language,
      pitch: 1.0,
      rate: 1.0,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.languageRow}>
        <Pressable
          style={[styles.langButton, language === "en-US" && styles.selected]}
          onPress={() => setLanguage("en-US")}
        >
          <Text style={styles.langText}>English</Text>
        </Pressable>

        <Pressable
          style={[styles.langButton, language === "fi-FI" && styles.selected]}
          onPress={() => setLanguage("fi-FI")}
        >
          <Text style={styles.langText}>Finnish</Text>
        </Pressable>

        <Pressable
          style={[styles.langButton, language === "sv-SE" && styles.selected]}
          onPress={() => setLanguage("sv-SE")}
        >
          <Text style={styles.langText}>Swedish</Text>
        </Pressable>
      </View>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type something here..."
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={speak}>
        <Text style={styles.buttonText}>SAY IT</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    padding: 20,
  },
  languageRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 6,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "white",
    borderRadius: 4,
  },
  selected: {
    backgroundColor: "#d9eaff",
  },
  langText: {
    fontSize: 12,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1e88e5",
    width: 80,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});