import React from 'react';
import { View, Text } from 'react-native';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

const ProgressIndicator = ({ currentStep, totalSteps, title }: ProgressIndicatorProps) => {
  return (
    <View className="mb-6">
      <Text className="text-gray-500 text-center mb-2">Step {currentStep} of {totalSteps}</Text>
      <View className="w-full h-2 bg-gray-200 rounded-full">
        <View 
          className="h-2 bg-[#624cf5] rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </View>
      <Text className="text-xl font-bold text-center mt-4">{title}</Text>
    </View>
  );
};

export default ProgressIndicator;