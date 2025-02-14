import React from "react";
import { TouchableOpacity, Text, Image, View } from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
const GoogleButton = ({ onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="h-12 border border-gray-300 rounded-lg gap-3 flex-row items-center justify-start bg-white"
  >
    <MaterialCommunityIcons
      name="google"
      size={24}
      color="blue"
      className="w-5 h-5 pl-3"
    />
    <Text className="text-gray-700 font-medium flex-1 text-center">Continue with Google</Text>
  </TouchableOpacity>
);

export default GoogleButton;