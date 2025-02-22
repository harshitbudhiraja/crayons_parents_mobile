import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "@clerk/clerk-expo";
import ChildFormModal from "@/components/ChildFormModal";
import Header from "@/components/Header";

interface ChildProfile {
  _id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
}

const ChildProfilesScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/child?userId=${user?.publicMetadata.userId}`
      );
      const data = await response.json();
      setChildren(data.data);
    } catch (error) {
      console.error('Error fetching children:', error);
      setError('Failed to load children profiles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleSuccess = () => {
    fetchChildren();
    setIsModalVisible(false);
    setSelectedChild(null);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <Header title="Child Profiles" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <Header title="Child Profiles" />
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center">
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <Header title="Child Profiles" />
      <View className="p-4">
        <View className="flex-row justify-center items-center mb-6">
          <TouchableOpacity 
            className="bg-[#624cf5] px-4 py-2 rounded-lg"
            onPress={() => {
              setSelectedChild(null);
              setIsModalVisible(true);
            }}
          >
            <Text className="text-white font-semibold">Add Child</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {children.map((child) => (
            <TouchableOpacity
              key={child._id}
              className="bg-white p-4 rounded-xl mb-3 shadow-sm"
              onPress={() => {
                setSelectedChild(child);
                setIsModalVisible(true);
              }}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons name="person-outline" size={24} color="#624cf5" />
                </View>
                <View className="ml-4">
                  <Text className="text-lg font-semibold">
                    {child.firstName} {child.lastName}
                  </Text>
                  <Text className="text-gray-500">
                    {new Date(child.dob).toLocaleDateString()}
                  </Text>
                  <Text className="text-gray-500">{child.gender}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ChildFormModal 
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedChild(null);
          }}
          selectedChild={selectedChild}
          onSuccess={handleSuccess}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChildProfilesScreen;