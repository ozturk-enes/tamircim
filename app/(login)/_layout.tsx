import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

export default function LoginLayout() {
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
        headerBackTitle: "", // yazıyı boş bırak
        headerBackVisible: true,
      }}
    >
      <Stack.Screen
        name="customerLogin"
        options={{
          title: "Müşteri Girişi",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="mechanicLogin"
        options={{
          title: "Tamirci Girişi",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="customerRegister"
        options={{
          title: "Müşteri Kayıt",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="mechanicRegister"
        options={{
          title: "Tamirci Kayıt",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
