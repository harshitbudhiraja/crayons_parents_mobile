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

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
    }
    if (Platform.OS !== "web") {
      void WebBrowser.coolDownAsync();
    }
    // Cleanup: closes browser when component unmounts
    void WebBrowser.coolDownAsync();
  }, []);
};

const RegisterScreen =  () => {
  useWarmUpBrowser();
  const { signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const initiateSSOFlow = async () => {
      const { createdSessionId } = await startSSOFlow({ strategy: "oauth_google" });
    };
    initiateSSOFlow();
  }, []);
  const handleGoogleRegister = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push("/home");
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const handleRegister = async () => {
    try {
      setLoading(true);

      // Validate form data
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.username ||
        !formData.emailAddress ||
        !formData.password
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      // Start the sign up process
      await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        emailAddress: formData.emailAddress,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification();

      // Navigate to verification screen
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

              {/* Username */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Username</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChangeText={(text) =>
                    setFormData({ ...formData, username: text })
                  }
                  autoCapitalize="none"
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

              {/* Phone Number */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">
                  Phone Number
                </Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phoneNumber: text })
                  }
                  keyboardType="phone-pad"
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
