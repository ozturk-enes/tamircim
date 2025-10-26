import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { mockUsers } from "@/constants/mockData";

export default function MechanicLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);

    // Mock login check
    const mechanic = mockUsers.mechanics.find(
      (user) => user.email === email && user.password === password
    );

    setTimeout(() => {
      setLoading(false);
      if (mechanic) {
        Alert.alert("Başarılı", "Giriş başarılı!", [
          {
            text: "Tamam",
            onPress: () => router.replace("/mechanic/(tabs)/home"),
          },
        ]);
      } else {
        Alert.alert("Hata", "E-posta veya şifre hatalı.");
      }
    }, 1000);
  };

  const handleRegister = () => {
    router.push("/(login)/mechanicRegister");
  };

  return (
    <LinearGradient
      colors={[Colors.light.lightOrange, Colors.light.background]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="construct-outline"
                  size={80}
                  color={Colors.light.secondary}
                />
              </View>
              <Text style={styles.title}>Tamirci Girişi</Text>
              <Text style={styles.subtitle}>
                Profesyonel hesabınıza giriş yapın
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail"
                  size={20}
                  color={Colors.light.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-posta"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={Colors.light.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={Colors.light.tabIconDefault}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerButtonText}>
                  Hesabınız yok mu? Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>

            {/* Demo Info */}
            <View style={styles.demoInfo}>
              <Text style={styles.demoTitle}>Demo Bilgileri:</Text>
              <Text style={styles.demoText}>E-posta: tamirci@test.com</Text>
              <Text style={styles.demoText}>Şifre: 123456</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.light.tabIconDefault,
    fontSize: 14,
  },
  registerButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  registerButtonText: {
    color: Colors.light.secondary,
    fontSize: 16,
    fontWeight: "500",
  },
  demoInfo: {
    backgroundColor: Colors.light.lightOrange,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.secondary,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 4,
  },
});
