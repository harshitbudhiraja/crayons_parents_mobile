import React from "react";
import { TouchableOpacity, Text, Image, View } from "react-native";

const GoogleButton = ({ onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="h-12 border border-gray-300 rounded-lg flex-row items-center justify-center bg-white"
  >
    <Image
      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
      className="w-5 h-5 mr-2"
    />
    <Text className="text-gray-700 font-medium">Continue with Google</Text>
  </TouchableOpacity>
);

export default GoogleButton;