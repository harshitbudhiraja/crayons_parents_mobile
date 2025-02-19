import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from '@react-native-community/datetimepicker';

interface ChildFormModalProps {
  visible: boolean;
  onClose: () => void;
  selectedChild: any;
  onSuccess: () => void;
}

const ChildFormModal = ({ visible, onClose, selectedChild, onSuccess }: ChildFormModalProps) => {
  const { user } = useUser();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: new Date().toISOString().split('T')[0],
    gender: 'Male'
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: ''
  });

  useEffect(() => {
    if (selectedChild) {
      setFormData({
        firstName: selectedChild.firstName,
        lastName: selectedChild.lastName,
        dob: selectedChild.dob,
        gender: selectedChild.gender
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        dob: new Date().toISOString().split('T')[0],
        gender: 'Male'
      });
    }
  }, [selectedChild]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      dob: '',
      gender: ''
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const method = selectedChild ? "PUT" : "POST";
      const url = `${process.env.EXPO_PUBLIC_API_URL}/child`;

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedChild?._id,
          ...formData,
          parent_id: user?.publicMetadata.userId,
        }),
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving child:', error);
      Alert.alert('Error', 'Failed to save child profile');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">
              {selectedChild ? 'Edit Child Profile' : 'Add Child Profile'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2">First Name</Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                placeholder="Enter first name"
                value={formData.firstName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
              />
              {errors.firstName ? (
                <Text className="text-red-500 text-sm mt-1">{errors.firstName}</Text>
              ) : null}
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Last Name</Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                placeholder="Enter last name"
                value={formData.lastName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
              />
              {errors.lastName ? (
                <Text className="text-red-500 text-sm mt-1">{errors.lastName}</Text>
              ) : null}
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Date of Birth</Text>
              <TouchableOpacity
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{new Date(formData.dob).toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(formData.dob)}
                  mode="date"
                  display="default"
                  maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 3))}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setFormData(prev => ({
                        ...prev,
                        dob: selectedDate.toISOString().split('T')[0]
                      }));
                    }
                  }}
                />
              )}
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Gender</Text>
              <View className="flex-row space-x-4">
                {['Male', 'Female'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    className={`flex-1 py-3 rounded-lg border ${
                      formData.gender === gender ? 'bg-[#624cf5] border-[#624cf5]' : 'border-gray-200'
                    }`}
                    onPress={() => setFormData(prev => ({ ...prev, gender }))}
                  >
                    <Text
                      className={`text-center ${
                        formData.gender === gender ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View className="flex-row space-x-4 mt-6">
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg border border-gray-200"
              onPress={onClose}
            >
              <Text className="text-center text-gray-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg bg-[#624cf5]"
              onPress={handleSubmit}
            >
              <Text className="text-center text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChildFormModal;