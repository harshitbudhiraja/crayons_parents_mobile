import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
  Alert,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useClerk, useUser } from "@clerk/clerk-expo";

interface UserProfile {
  name: string;
  email: string;
  imageUrl: string;
  joinedDate: string;
}

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  route: string;
  color?: string;
}

const ProfileScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  // Mock user data - replace with actual user data
  const userProfile: UserProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    imageUrl: "https://ui-avatars.com/api/?name=John+Doe",
    joinedDate: "Member since Feb 2024",
  };

  const menuItems = [
    {
      icon: <Ionicons name="people-outline" size={24} color="#624cf5" />,
      title: "Child Profiles",
      subtitle: "Manage your children's profiles",
      route: "/child-profiles",
    },
    {
      icon: <Ionicons name="ticket-outline" size={24} color="#624cf5" />,
      title: "My Tickets",
      subtitle: "View your upcoming & past event tickets",
      route: "/ticket",
    },
    {
      icon: <Ionicons name="calendar-outline" size={24} color="#624cf5" />,
      title: "My Events",
      subtitle: "Track events you're interested in",
      route: "/events",
    },
    {
      icon: <Ionicons name="heart-outline" size={24} color="#624cf5" />,
      title: "Saved Events",
      subtitle: "Quick access to events you've bookmarked",
      route: "/saved",
    },
    {
      icon: <Ionicons name="card-outline" size={24} color="#624cf5" />,
      title: "Payment Methods",
      subtitle: "Manage your payment options",
      route: "/payments",
    },
    {
      icon: <Ionicons name="notifications-outline" size={24} color="#624cf5" />,
      title: "Notifications",
      subtitle: "Control your notification preferences",
      route: "/notifications",
    },
    {
      icon: <Ionicons name="settings-outline" size={24} color="#624cf5" />,
      title: "Settings",
      subtitle: "Manage your account settings",
      route: "/settings",
    },
  ];

  const handleUserEdit = () => {
    // Handle user profile edit
    // Maybe open the clerk modal or something
    console.log("Edit profile clicked");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.push("/login");
        },
      },
    ]);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const MenuItem = ({
    icon,
    title,
    subtitle,
    route,
    color = "#624cf5",
  }: MenuItem) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100"
      onPress={() => router.push("profile/" + route)}
    >
      <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center">
        {icon}
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-base font-semibold text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-500">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="mt-4"
      >
        {/* Profile Header */}
        <View className="bg-white px-4 py-6 border-b border-gray-100">
          <View className="flex-row items-center">
            <Image
              source={{ uri: user.imageUrl }}
              className="w-20 h-20 rounded-full"
            />
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </Text>
              <Text className="text-gray-500">
                {user.emailAddresses[0].emailAddress}
              </Text>
              <Text className="text-sm text-gray-400 mt-1">
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="mt-4 bg-gray-50 px-4 py-3 rounded-xl flex-row items-center"
            onPress={handleUserEdit}
          >
            <Ionicons name="person-outline" size={20} color="#624cf5" />
            <Text className="ml-2 text-[#624cf5] font-medium">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View className="flex-row px-4 py-4 bg-white mt-2">
          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="text-2xl font-bold text-[#624cf5]">12</Text>
            <Text className="text-sm text-gray-500">Events Attended</Text>
          </View>
          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="text-2xl font-bold text-[#624cf5]">5</Text>
            <Text className="text-sm text-gray-500">Upcoming Events</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mt-2">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="flex-row items-center px-4 py-4 bg-white mt-2 border-t border-b border-gray-100"
          onPress={handleLogout}
        >
          <View className="w-12 h-12 rounded-full bg-red-50 items-center justify-center">
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-base font-semibold text-red-500">Logout</Text>
            <Text className="text-sm text-gray-500">
              Sign out of your account
            </Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
