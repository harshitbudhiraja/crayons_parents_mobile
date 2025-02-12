import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";

const PRIMARY_COLOR = "#624cf5";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError('');

      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        setError('Sign in process incomplete. Please try again.');
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      setError('Invalid email or password');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</Text>
          <Text className="text-gray-600">Sign in to continue to Crayons</Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View className="mb-4 p-3 bg-red-50 rounded-lg">
            <Text className="text-red-500 text-sm">{error}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Email Address</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <Ionicons name="mail-outline" size={20} color="gray" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-900"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <Ionicons name="lock-closed-outline" size={20} color="gray" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-900"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="gray" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            className="mt-6 rounded-lg py-4"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onPress={onSignInPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text style={{ color: PRIMARY_COLOR }} className="font-semibold">
                  Sign up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}