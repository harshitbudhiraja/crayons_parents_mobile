import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

const EditProfilePage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!formData.firstName || !formData.lastName) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      await user?.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (err) {
      console.error("Error updating profile:", err);
      Alert.alert(
        "Update Failed",
        err.errors?.[0]?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          <View className="py-8">
            {/* Header Section */}
            <View className="items-center mb-6">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Edit Profile
              </Text>
              <Text className="text-gray-500 text-center">
                Update your profile information
              </Text>
            </View>

            {/* Form Section */}
            <View className="space-y-4">
              {/* Email */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-100"
                  value={user?.emailAddresses[0]?.emailAddress || ""}
                  editable={false}
                />
              </View>

              {/* Phone Number */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">
                  Phone Number
                </Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-100"
                  value={user?.phoneNumbers[0]?.phoneNumber || ""}
                  editable={false}
                />
              </View>

              {/* First Name */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">First Name</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, firstName: text })
                  }
                />
              </View>

              {/* Last Name */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Last Name</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, lastName: text })
                  }
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className={`h-12 bg-[#624cf5] rounded-lg items-center justify-center mt-4 ${
                  loading ? "opacity-70" : ""
                }`}
                onPress={handleSave}
                disabled={loading}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                className="h-12 border my-3 border-gray-300 rounded-lg items-center justify-center"
                onPress={() => router.back()}
                disabled={loading}
              >
                <Text className="text-gray-700 font-bold  text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfilePage;