import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import * as Contacts from "expo-contacts";

type ContactItem = {
  id: string;
  name: string;
  phone: string;
};

export default function App() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  const getContacts = async () => {
    // pyydä lupa
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied", "Cannot access contacts");
      return;
    }

    // hae kontaktit
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    // muokkaa data
    const list: ContactItem[] = data
      .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
      .map((c) => ({
        id: c.id,
        name: c.name || "No name",
        phone: c.phoneNumbers![0].number || "",
      }));

    setContacts(list);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.name} {item.phone}
          </Text>
        )}
      />

      <Pressable style={styles.button} onPress={getContacts}>
        <Text style={styles.buttonText}>GET CONTACTS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  item: {
    fontSize: 14,
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#1e88e5",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});