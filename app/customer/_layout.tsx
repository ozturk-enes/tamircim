import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.primary,
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerBackTitle: "",
        headerBackVisible: true,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="VehicleDetailScreen" options={{ title: "Araç Detayı" }} />
      <Stack.Screen name="AddVehicleScreen" options={{ title: "Yeni Araç" }} />
    </Stack>
  );
}