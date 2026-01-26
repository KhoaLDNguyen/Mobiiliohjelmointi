import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Tabs-näkymä */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modal (valinnainen, voi jäädä) */}
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
