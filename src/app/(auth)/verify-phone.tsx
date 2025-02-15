import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import ProgressIndicator from '@/components/ProgressIndicator';

const VerifyPhoneScreen = () => {
  const { signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    try {
      setLoading(true);

      await signUp?.attemptPhoneNumberVerification({
        code,
      });

      if (signUp?.status === 'complete') {
        // Set the user's session
        await setActive({ session: signUp.createdSessionId });
        router.push('/home');
      } else {
        // For the manual registration flow, navigate to email verification
        await signUp?.prepareEmailAddressVerification();
        router.push('/verify-email');
      }
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Verification Failed', err.errors?.[0]?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await signUp?.preparePhoneNumberVerification();
      setResendTimer(30);
      Alert.alert('Success', 'New code sent successfully');
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', 'Failed to resend code');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 py-8">
          <ProgressIndicator 
            currentStep={3} 
            totalSteps={3} 
            title="Verify Your Phone" 
          />

          <View className="space-y-4">
            <Text className="text-center text-gray-600 mb-6">
              We've sent a verification code to your phone number
            </Text>

            {/* Verification Code Input */}
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 text-center text-xl tracking-widest"
              placeholder="Enter code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />

            {/* Verify Button */}
            <TouchableOpacity
              className={`h-12 bg-[#624cf5] rounded-lg items-center justify-center mt-6 ${
                loading ? 'opacity-70' : ''
              }`}
              onPress={handleVerify}
              disabled={loading || code.length < 6}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? 'Verifying...' : 'Verify Phone'}
              </Text>
            </TouchableOpacity>

            {/* Resend Code */}
            <TouchableOpacity 
              onPress={handleResendCode}
              disabled={resendTimer > 0}
              className="mt-4"
            >
              <Text className="text-center text-[#624cf5]">
                {resendTimer > 0 
                  ? `Resend code in ${resendTimer}s` 
                  : 'Resend code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyPhoneScreen;