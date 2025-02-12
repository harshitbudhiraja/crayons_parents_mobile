import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const PRIMARY_COLOR = "#624cf5";

const EventCard = ({ event }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <TouchableOpacity 
      onPress={() => router.push(`/event/${String(event._id.$oid)}`)}
      className="rounded-xl overflow-hidden bg-white shadow-md mb-2"
      style={{ 
        transform: [{ scale: 1 }],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}
    >
      <View className="relative">
        <Image 
          source={{ uri: event.imageUrl }} 
          className="h-40 w-full"
          resizeMode="cover"
        />
        <View 
          className="absolute top-2 left-0 px-2 py-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <Text className="text-white font-bold">
            {event.ageRange.min} - {event.ageRange.max} Y
          </Text>
        </View>
        {event.address.latitude && (
          <View 
            className="absolute bottom-2 right-2 px-2 py-1 rounded"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <Text className="text-white text-xs">5 km</Text>
          </View>
        )}
      </View>
      
      <View className="p-2">
        <View className="flex-row justify-between items-start">
          <Text 
            className="flex-1 pr-2 font-bold text-base"
            numberOfLines={2}
          >
            {event.title}
          </Text>
          <View 
            className="px-2 py-1 rounded"
            style={{ backgroundColor: '#f0f0f0' }}
          >
            <Text style={{ color: PRIMARY_COLOR }}>
              {event.isFree ? "FREE" : `₹${event.price}`}
            </Text>
          </View>
        </View>
        
        <View className="mt-2 space-y-1">
          <View className="flex-row items-center">
            <Ionicons name="calendar" size={14} color="gray" />
            <Text className="ml-2 text-xs text-gray-600">
              {formatDate(new Date(event.startDateTime))}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location" size={14} color="gray" />
            <Text className="ml-2 text-xs text-gray-600">
              {event.address.city}, {event.address.state}
            </Text>
          </View>
        </View>
        
        <View 
          className="mt-2 pt-2 border-t flex-row justify-between items-center"
          style={{ borderTopColor: '#f0f0f0', borderTopWidth: 1 }}
        >
          <View className="flex-row items-center">
            <Ionicons name="person" size={14} color="gray" />
            <Text className="ml-2 text-xs text-gray-600">
              {event.organizer.firstName} {event.organizer.lastName}
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={{ color: PRIMARY_COLOR }}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;