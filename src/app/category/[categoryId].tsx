import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
// import { SearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import EventCard from '@/components/EventCard';
import { router, useLocalSearchParams } from 'expo-router';
import fakeEvents from 'crayons.events.json';

const CategoryDetailsScreen = () => {
  const { id } = useLocalSearchParams() as { id: string };
  const PRIMARY_COLOR = "#624cf5";
  
  // In a real app, you would fetch these based on the category ID
  const featuredEvents = fakeEvents.slice(0, 3);
  const newEvents = [...fakeEvents].sort((a, b) => new Date(b.startDateTime.$date).getTime() - new Date(a.startDateTime.$date).getTime());
  const upcomingEvents = [...fakeEvents].filter(event => 
    new Date(event.startDateTime.$date) > new Date()
  );

  const renderSectionHeader = (title: string, description?: string) => (
    <View className="px-4 mb-4">
      <Text className="text-lg font-bold text-gray-800">{title}</Text>
      {description && (
        <Text className="text-sm text-gray-600 mt-1">{description}</Text>
      )}
    </View>
  );

  const renderEventList = (events: typeof fakeEvents, horizontal = true) => (
    <FlatList
      data={events}
      horizontal={horizontal}
      renderItem={({ item }) => <EventCard event={item} />}
      keyExtractor={(item) => item._id.$oid}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        columnGap: 16,
        paddingBottom: horizontal ? 0 : 16
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View
        className="p-4 flex-row justify-between items-center"
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            {decodeURIComponent(id as string)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("search")}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Featured Events */}
        <View className="py-4">
          {renderSectionHeader(
            "Featured Events",
            "Don't miss out on these highlighted experiences"
          )}
          {renderEventList(featuredEvents)}
        </View>

        {/* New Events */}
        <View className="py-4">
          {renderSectionHeader(
            "New Events",
            "Fresh additions to our collection"
          )}
          {renderEventList(newEvents)}
        </View>

        {/* Upcoming Events */}
        <View className="py-4">
          {renderSectionHeader(
            "All Upcoming Events",
            "Browse all upcoming events in this category"
          )}
          {renderEventList(upcomingEvents, false)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryDetailsScreen;