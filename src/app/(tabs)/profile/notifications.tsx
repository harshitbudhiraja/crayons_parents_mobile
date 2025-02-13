import {
  View,
  Text,
  Switch,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native";
import Header from "@/components/Header";
import { Bell } from "lucide-react-native";
import React, { useState } from "react";
const NotificationsScreen = () => {
  const [notificationSettings, setNotificationSettings] = useState([
    {
      id: 1,
      title: "Push Notifications",
      description: "Receive push notifications",
      enabled: true,
    },
    {
      id: 2,
      title: "Email Notifications",
      description: "Receive email updates",
      enabled: true,
    },
    {
      id: 3,
      title: "Event Reminders",
      description: "Get reminded before events",
      enabled: true,
    },
    {
      id: 4,
      title: "Promotional Emails",
      description: "Receive offers and updates",
      enabled: false,
    },
  ]);

  const renderNotificationSetting = ({ item }) => (
    <View className="flex-row items-center bg-white p-4 border-b border-gray-100">
      <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center">
        <Bell size={24} color="#624cf5" />
      </View>
      <View className="flex ml-4 flex-1">
        <Text className="text-base font-semibold">{item.title}</Text>
        <Text className="text-sm text-gray-500">{item.description}</Text>
      </View>
      <Switch
        value={item.enabled}
        onValueChange={() => {
          setNotificationSettings((prevSettings) =>
            prevSettings.map((setting) =>
              setting.id === item.id
                ? { ...setting, enabled: !setting.enabled }
                : setting
            )
          );
        }}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <Header title="Notifications" />
      <FlatList
        data={notificationSettings}
        renderItem={renderNotificationSetting}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;
