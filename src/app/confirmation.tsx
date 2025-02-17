import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import * as Clipboard from 'expo-clipboard'; 

const ConfirmationPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [copied, setCopied] = useState(false);
  
  const status = params.status || 'success';
  const eventTitle = params.eventTitle as string;
  const payment_id = params.payment_id as string;
  const errorMessage = params.error as string;

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(`${process.env.EXPO_PUBLIC_APP_URL}/events/${params.event_id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-1 items-center justify-center">
        {status === 'success' ? (
          <>
            <View className="w-20 h-20 mb-6 items-center justify-center">
              <Ionicons name="checkmark-circle" size={75} color="#10b981" />
            </View>
            <Text className="text-2xl font-bold mb-4">Thank you for your order!</Text>
          </>
        ) : (
          <>
            <View className="mb-6">
              <Ionicons name="alert-circle" size={75} color="#ef4444" />
            </View>
            <Text className="text-2xl font-bold text-red-500 mb-4">Payment Failed</Text>
            {errorMessage && (
              <Text className="text-red-500 text-base mb-4">{errorMessage}</Text>
            )}
          </>
        )}

        {eventTitle && status === 'success' && (
          <View className="items-center mb-6">
            <Text className="text-lg text-center mb-4">
              Your ticket for {eventTitle} has been confirmed.
            </Text>
            <View className="flex-row items-center">
              <Text className="text-lg">Share the event link with your friends</Text>
              <TouchableOpacity 
                onPress={handleCopy}
                className="ml-2 p-2 bg-gray-100 rounded-md"
              >
                <Ionicons name="copy-outline" size={20} color="#624cf5" />
              </TouchableOpacity>
            </View>
            {copied && (
              <Text className="text-green-500 text-sm mt-2">Copied!</Text>
            )}
          </View>
        )}

        {status === 'success' && (
          <View className="items-center mb-6">
            <View className="w-48 h-48 bg-gray-100 rounded-lg mb-4 items-center justify-center">
              {/* QR Code placeholder - you'll need to implement actual QR code generation */}
              <Text className="text-gray-500">QR Code</Text>
            </View>
            <Text className="font-bold text-[#624cf5] mb-4">{payment_id}</Text>
          </View>
        )}

        <View className="flex-row space-x-4 w-full px-4">
          {status === 'success' ? (
            <>
              <TouchableOpacity
                onPress={() => router.push("/profile/ticket")}
                className="flex-1 bg-[#624cf5] p-4 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">My Tickets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/home")}
                className="flex-1 border border-gray-200 p-4 rounded-lg items-center"
              >
                <Text className="font-semibold">Back to Home</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1 bg-red-500 p-4 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/home")}
                className="flex-1 border border-gray-200 p-4 rounded-lg items-center"
              >
                <Text className="font-semibold">Back to Home</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ConfirmationPage;