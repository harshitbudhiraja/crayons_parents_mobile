import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import GoogleButton from "@/components/GoogleButton";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

const LoginScreen = () => {
  useWarmUpBrowser();
  const { signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: "acme://clerk-sso-callback",
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.push("/home");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", "Failed to sign in with Google");
    }
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!formData.emailOrUsername || !formData.password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const completeSignIn = await signIn.create({
        identifier: formData.emailOrUsername,
        password: formData.password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      router.push("/home");
    } catch (err) {
      console.error("Error during login:", err);
      Alert.alert(
        "Login Failed",
        err.errors?.[0]?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          <View className="py-8">
            {/* Header Section */}
            <View className="items-center mb-6">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-500 text-center">
                Sign in to continue to your account
              </Text>
            </View>

            {/* Google Sign In Button */}
            <GoogleButton onPress={handleGoogleLogin} />

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500">or</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* Form Section */}
            <View className="space-y-4">
              {/* Email/Username */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">
                  Email or Username
                </Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Enter your email or username"
                  value={formData.emailOrUsername}
                  onChangeText={(text) =>
                    setFormData({ ...formData, emailOrUsername: text })
                  }
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChangeText={(text) =>
                      setFormData({ ...formData, password: text })
                    }
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                className="items-end"
                onPress={() => router.push("/forgot-password")}
              >
                <Text className="text-[#624cf5]">Forgot Password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                className={`h-12 bg-[#624cf5] rounded-lg items-center justify-center mt-4 ${
                  loading ? "opacity-70" : ""
                }`}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View className="mt-8 flex-row justify-center">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className="text-[#624cf5] font-bold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;