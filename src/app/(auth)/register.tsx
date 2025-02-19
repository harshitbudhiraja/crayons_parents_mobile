import React, { useEffect, useState } from "react";
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
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import GoogleButton from "@/components/GoogleButton";
import { useCallback } from "react";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

const RegisterScreen = () => {
  useWarmUpBrowser();
  const { signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push("/home");
        return;
      }

      if (signUp) {
        router.push({
          pathname: "/complete-profile",
          params: { email: signUp.emailAddress },
        });
      } else if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push("/");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const handleRegister = async () => {
    try {
      setLoading(true);
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.emailAddress ||
        !formData.password
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }
      await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification();
      router.push("/verify-email");
    } catch (err) {
      console.error("Error during registration:", err);
      Alert.alert(
        "Registration Failed",
        err.errors?.[0]?.message || "Please try again"
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
                Create Account
              </Text>
              <Text className="text-gray-500 text-center">
                Join us and start exploring amazing events
              </Text>
            </View>

            {/* Google Sign Up Button */}
            <GoogleButton onPress={handleGoogleRegister} />

            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500">or</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* Form Section */}
            <View className="space-y-4">
              {/* First Name */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">
                  First Name
                </Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, firstName: text })
                  }
                />
              </View>

              {/* Last Name */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">
                  Last Name
                </Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, lastName: text })
                  }
                />
              </View>

              {/* Email */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">
                  Email Address
                </Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Enter your email"
                  value={formData.emailAddress}
                  onChangeText={(text) =>
                    setFormData({ ...formData, emailAddress: text })
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Create password"
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

              {/* Sign Up Button */}
              <TouchableOpacity
                className={`h-12 bg-[#624cf5] rounded-lg items-center justify-center mt-4 ${
                  loading ? "opacity-70" : ""
                }`}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? "Creating Account..." : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View className="mt-8 flex-row justify-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-[#624cf5] font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;