import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";


type RatesResponse = {
  success?: boolean;
  base?: string;          
  rates?: Record<string, number>;
 
};

const API_KEY = "gCeEhe95UOTMBlHRfzUDWy9EAGrmjYOU"; 
const API_URL = "https://api.apilayer.com/exchangerates_data/latest";

export default function App() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [currency, setCurrency] = useState<string>("USD");
  const [amount, setAmount] = useState<string>("250");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const currencyList = useMemo(() => Object.keys(rates).sort(), [rates]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);

        if (!API_KEY) {
  Alert.alert("API key puuttuu", "Lisää apilayer API key App.tsx:ään (API_KEY).");
  setLoading(false);
  return;
}


      const res = await fetch(API_URL, {
  headers: { apikey: API_KEY },
});

const data: any = await res.json();

if (!res.ok) {
  Alert.alert("Virhe", `API error (${res.status}): ${data?.message ?? "unknown error"}`);
  setRates({});
  return;
}

if (!data?.rates) {
  Alert.alert("Virhe", "Kurssien haku epäonnistui. Tarkista API key ja tilaus.");
  setRates({});
  return;
}

setRates(data.rates as Record<string, number>);


        
        if (data.rates["GBP"]) setCurrency("GBP");
        else if (data.rates["USD"]) setCurrency("USD");
        else {
          const first = Object.keys(data.rates)[0];
          if (first) setCurrency(first);
        }
      } catch (e) {
        Alert.alert("Virhe", "Kurssien haku epäonnistui (verkko/API).");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertToEur = () => {
    const n = Number(amount.replace(",", "."));
    if (!isFinite(n)) {
      Alert.alert("Virhe", "Syötä numero (esim. 250).");
      return;
    }

    const rate = rates[currency];
    if (!rate) {
      Alert.alert("Virhe", "Valuuttaa ei löydy kurssilistasta.");
      return;
    }

   
    const eur = n / rate;
    setResult(eur.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bigResult}>
        {result ? `${result} €` : "0.00 €"}
      </Text>

      <View style={styles.row}>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Amount"
        />

        <View style={styles.pickerBox}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Picker selectedValue={currency} onValueChange={setCurrency} style={styles.picker}>
              {currencyList.map((code) => (
                <Picker.Item key={code} label={code} value={code} />
              ))}
            </Picker>
          )}
        </View>
      </View>

      <Pressable style={styles.btn} onPress={convertToEur} disabled={loading}>
        <Text style={styles.btnText}>CONVERT</Text>
      </Pressable>

      <Text style={styles.note}>Muuntaa valitun valuutan euroiksi (EUR).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center", padding: 20 },
  bigResult: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  input: { width: 120, height: 36, borderWidth: 1, borderColor: "#999", paddingHorizontal: 10 },
  pickerBox: { width: 120, height: 36, borderWidth: 1, borderColor: "#999", justifyContent: "center" },
  picker: { height: 36, width: 120 },
  btn: { height: 36, width: 140, backgroundColor: "#1e88e5", alignItems: "center", justifyContent: "center", borderRadius: 2 },
  btnText: { color: "white", fontWeight: "700", fontSize: 12 },
  note: { marginTop: 10, fontSize: 12, color: "#666" },
});
