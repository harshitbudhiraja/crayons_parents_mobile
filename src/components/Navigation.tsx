import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname, useSegments } from "expo-router";

const PRIMARY_COLOR = "#624cf5";

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");
  const pathName = usePathname();

  useEffect(() => {
    setActiveTab(pathName);
  }, [pathName]);
  const NavButton = ({ icon, name, onPress }) => (
    <TouchableOpacity
      className="flex-1 items-center justify-center"
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={24}
        color={activeTab === name ? PRIMARY_COLOR : "gray"}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <View
        className="flex-row justify-around items-center h-16 border-t"
        style={{
          borderTopColor: "#f0f0f0",
          backgroundColor: "white",
        }}
      >
        <NavButton
          icon="home"
          name="/home"
          onPress={() => {
            setActiveTab("/home");
            router.replace("/home");
          }}
        />
        <NavButton
          icon="search"
          name="/search"
          onPress={() => {
            setActiveTab("/search");
            router.replace("/search");
          }}
        />
        <NavButton
          icon="person"
          name="/profile"
          onPress={() => {
            setActiveTab("/profile");
            router.replace("/profile");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BottomNavigation;
