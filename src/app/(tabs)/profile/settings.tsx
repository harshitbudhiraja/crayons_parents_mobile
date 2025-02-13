import {
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  FlatList,
  SafeAreaView,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import Header from "@/components/Header";
const SettingsScreen = () => {
  const settingsOptions = [
    {
      id: 1,
      title: "Account Security",
      description: "Password, 2FA, login history",
    },
    {
      id: 2,
      title: "Privacy",
      description: "Control your privacy settings",
    },
    {
      id: 3,
      title: "Language",
      description: "Change app language",
    },
    {
      id: 4,
      title: "Help & Support",
      description: "FAQs, contact support",
    },
    {
      id: 5,
      title: "About",
      description: "App version, terms, privacy policy",
    },
  ];

  const renderSettingsOption = ({ item }) => (
    <TouchableOpacity className="flex-row items-center bg-white p-4 border-b border-gray-100">
      <View className="flex-1">
        <Text className="text-base font-semibold">{item.title}</Text>
        <Text className="text-gray-500">{item.description}</Text>
      </View>
      <ChevronLeft size={20} color="#9ca3af" className="rotate-180" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <Header title="Settings" />
      <FlatList
        data={settingsOptions}
        renderItem={renderSettingsOption}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
