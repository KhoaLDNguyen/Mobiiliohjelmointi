import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LaskinNaytto from "./screens/Laskinanaytto";
import HistoriaNaytto from "./screens/Historianaytto";

export type RootStackParamList = {
  Calculator: undefined;
  History: { history: string[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calculator">
        <Stack.Screen name="Calculator" component={LaskinNaytto} />
        <Stack.Screen name="History" component={HistoriaNaytto} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
