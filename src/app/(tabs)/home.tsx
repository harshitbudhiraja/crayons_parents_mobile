import React, { useState } from "react";
import EventCard from "@/components/EventCard";
import Carousel from "react-native-reanimated-carousel";
import CategoryCard from "@/components/CategoryCard";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import fakeData from "crayons.events.json";
import { router } from "expo-router";

const PRIMARY_COLOR = "#624cf5";
const { width } = Dimensions.get("screen");
const categories = [
  {
    id: 1,
    name: "Art & Craft",
    image:
      "https://images.unsplash.com/photo-1499892477393-f675706cbe6e?q=80&w=1000",
  },
  {
    id: 2,
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000",
  },
  {
    id: 3,
    name: "Music",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000",
  },
  {
    id: 4,
    name: "Education",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000",
  },
  {
    id: 5,
    name: "Science & Technology",
    image:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000",
  },
  {
    id: 6,
    name: "Performing Arts",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1000",
  },
  {
    id: 7,
    name: "Mental Challenges",
    image:
      "https://images.unsplash.com/photo-1509909756405-be0199881695?q=80&w=1000",
  },
  {
    id: 8,
    name: "Creative Skills",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000",
  },
];

const handleCategoryPress = (category) => {
  // Handle category selection
  router.push(`/category/${category.id}`);
  console.log(`Selected category: ${category.name}`);
};

const HomeScreen = () => {
  const [events] = useState(fakeData);

  const renderSectionHeader = (title) => (
    <Text className="text-lg font-bold text-gray-800 px-4 mb-2">{title}</Text>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View
        className="p-4 flex-row justify-between items-center"
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <Text className="text-white text-xl font-bold">Discover Events</Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity onPress={() => router.push("search")}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <Carousel
          width={width}
          height={250}
          data={events}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: width, height: 250, resizeMode: "cover" }}
            />
          )}
          scrollAnimationDuration={600}
          loop
        />

        <View className="py-4">
          {renderSectionHeader("Popular Categories")}
          <FlatList
            data={categories}
            horizontal={true}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => handleCategoryPress(item)}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
          />
        </View>

        {/* Upcoming Events Section */}
        <View className="py-4">
          {renderSectionHeader("Upcoming Events")}
          <FlatList
            data={events}
            horizontal={true}
            renderItem={({ item }) => <EventCard event={item} />}
            keyExtractor={(item) => item._id.$oid}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              columnGap: 16,
            }}
          />
        </View>

        {/* Popular Events Section */}
        <View className="py-4">
          {renderSectionHeader("Popular Events")}
          <FlatList
            data={events}
            horizontal={true}
            renderItem={({ item }) => <EventCard event={item} />}
            keyExtractor={(item) => item._id.$oid}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              columnGap: 16,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
