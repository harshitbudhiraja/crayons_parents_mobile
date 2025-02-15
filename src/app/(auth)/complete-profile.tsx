import React, { useState } from 'react';
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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ProgressIndicator from '@/components/ProgressIndicator';
import { useSignUp } from '@clerk/clerk-expo';

const CompleteProfileScreen = () => {
  const { email } = useLocalSearchParams();
  const { signUp, setActive } = useSignUp();
  
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setLoading(true);

      if (!formData.username || !formData.phoneNumber) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Update the sign-up process with additional data
      await signUp?.update({
        username: formData.username,
        phoneNumber: formData.phoneNumber,
      });

      // Start phone verification
      await signUp?.preparePhoneNumberVerification();
      
      // Navigate to phone verification
      router.push('/verify-phone');
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          <View className="py-8">
            <ProgressIndicator 
              currentStep={2} 
              totalSteps={3} 
              title="Complete Your Profile" 
            />

            <View className="space-y-4">
              {/* Email (Read-only) */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Email Address</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-100"
                  value={email as string}
                  editable={false}
                />
              </View>

              {/* Username */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Username</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChangeText={(text) => setFormData({ ...formData, username: text })}
                  autoCapitalize="none"
                />
              </View>

              {/* Phone Number */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Phone Number</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                className={`h-12 bg-[#624cf5] rounded-lg items-center justify-center mt-6 ${
                  loading ? 'opacity-70' : ''
                }`}
                onPress={handleContinue}
                disabled={loading}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? 'Processing...' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CompleteProfileScreen;