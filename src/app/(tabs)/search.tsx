import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { debounce } from "@/lib/utils";
import { router } from "expo-router";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const searchInput = useRef(null);
  const filters = ["All", "Free", "Paid", "Today", "This Week", "This Month"];

  const filterEvents = (events, filter) => {
    const now = new Date();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return events.filter((event) => {
      const eventDate = new Date(event.startDateTime);

      switch (filter) {
        case "Free":
          return event.isFree;
        case "Paid":
          return !event.isFree;
        case "Today":
          return eventDate.toDateString() === now.toDateString();
        case "This Week":
          return eventDate >= thisWeek && eventDate <= now;
        case "This Month":
          return eventDate >= thisMonth && eventDate <= now;
        default:
          return true;
      }
    });
  };

  const fetchEvents = async (query, filter) => {
    try {
      const params = new URLSearchParams({
        query: query,
        limit: '20',
        page: '1'
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/events?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      
      const events = responseData.data || [];

      if (filter !== "All") {
        return filterEvents(events, filter);
      }

      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query, filter) => {
      setIsLoading(true);
      try {
        const results = await fetchEvents(query, filter);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useFocusEffect(
    useCallback(() => {
      if (searchQuery) {
        debouncedSearch(searchQuery, activeFilter);
      }
    }, [activeFilter])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price, isFree) => {
    if (isFree) return "Free";
    return `₹${price}`;
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      className="flex-row p-4 border-b border-gray-100"
      onPress={() => router.push(`/event/${item._id}`)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        className="w-24 h-24 rounded-lg"
        style={{ backgroundColor: "#f0f0f0" }}
      />
      <View className="flex-1 ml-4">
        <Text
          className="text-base font-semibold text-gray-800"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
          {item.description}
        </Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-sm font-medium text-[#624cf5]">
            {formatPrice(item.price, item.isFree)}
          </Text>
          <Text className="text-xs text-gray-500">
            {formatDate(item.startDateTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      debouncedSearch(text, activeFilter);
    } else {
      setSearchResults([]);
    }
  };

  const SearchHeader = () => (
    <View className="px-4 py-2 border-b border-gray-200">
      <View className="flex-row items-center bg-gray-50 rounded-xl px-4 h-12">
        <Ionicons name="search" size={20} color="#624cf5" />
        <TextInput
          ref={searchInput}
          className="flex-1 ml-2 text-base"
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setSearchResults([]);
              searchInput.current?.focus();
            }}
          >
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center px-4">
      <Ionicons
        name="search"
        size={48}
        color="#624cf5"
        className="opacity-20"
      />
      <Text className="text-xl font-semibold text-gray-800 mt-4">
        No results found
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        Try adjusting your search or filter to find what you're looking for
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {SearchHeader()}

      {/* Filters */}
      <View className="py-2">
        <FlatList
          horizontal
          data={filters}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              className={`px-4 py-2 rounded-full mr-2 ${
                activeFilter === item
                  ? "bg-[#624cf5]"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <Text
                className={`${
                  activeFilter === item ? "text-white" : "text-gray-600"
                } font-medium`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      {/* Results */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#624cf5" />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={searchQuery ? <EmptyState /> : null}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;