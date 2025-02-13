import { router } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import { ChevronLeft } from "lucide-react-native";

const Header = ({ title }: { title: string }) => {
  return (
    <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
      <TouchableOpacity onPress={() => router.back()}>
        <ChevronLeft size={24} color="#000" />
      </TouchableOpacity>
      <Text className="flex-1 text-xl font-semibold text-center ml-4">
        {title}
      </Text>
    </View>
  );
};

export default Header;
