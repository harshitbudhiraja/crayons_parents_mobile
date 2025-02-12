import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import GoogleButton from "@/components/GoogleButton";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleRegister = () => {
    console.log("Registration attempted with:", formData);
  };

  const handleGoogleRegister = () => {
    console.log("Google registration attempted");
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          <View className="py-12">
            {/* Header Section */}
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-gray-800 mb-2">Create Account</Text>
              <Text className="text-gray-500 text-center">
                Join us and start exploring amazing events
              </Text>
            </View>

            {/* Form Section */}
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({...formData, fullName: text})}
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Create password"
                    value={formData.password}
                    onChangeText={(text) => setFormData({...formData, password: text})}
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

              <View>
                <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity 
                    className="absolute right-4 top-3"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color="gray" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className="h-12 bg-[#624cf5] rounded-lg items-center justify-center mt-4"
                onPress={handleRegister}
              >
                <Text className="text-white font-bold text-lg">Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="mx-4 text-gray-500">or</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
              </View>

              {/* Google Button */}
              <GoogleButton onPress={handleGoogleRegister} />
            </View>

            {/* Footer Section */}
            <View className="mt-8 flex-row justify-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-[#624cf5] font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;