import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import useHttpHook from "@/hooks/useHttpHook";
import Header from "@/components/Header";

interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDateTime: string;
  price: number;
}

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useUser();
  const { isLoading, error, fetchData } = useHttpHook();
  const [wishlistedEvents, setWishlistedEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWishlistedEvents = async () => {
    if (!user) return;
    
    const userId = user.publicMetadata.userId as string;
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    try {
      const events = await fetchData(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/wishlist`
      );
      setWishlistedEvents(events);
    } catch (err) {
      console.error("Failed to fetch wishlisted events:", err);
    }
  };

  useEffect(() => {
    fetchWishlistedEvents();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishlistedEvents();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const removeFromWishlist = async (eventId: string) => {
    if (!user) return;
    
    const userId = user.publicMetadata.userId as string;
    if (!userId) return;

    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/wishlist`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId,
          }),
        }
      );
      // Update local state to remove the event
      setWishlistedEvents(wishlistedEvents.filter(event => event._id !== eventId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-8">
      <Ionicons name="heart-outline" size={64} color="#c7c7c7" />
      <Text className="text-xl font-semibold text-center mt-4 text-gray-700">
        Your wishlist is empty
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        Save your favorite events by tapping the heart icon on the event details page
      </Text>
      <TouchableOpacity
        className="mt-6 bg-[#624cf5] px-6 py-3 rounded-xl"
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text className="text-white font-semibold">Discover Events</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEventItem = ({ item }: { item: Event }) => (
    <View className="bg-white mb-4 rounded-xl overflow-hidden shadow-sm">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/event/${item._id}`)}
      >
        <View className="relative">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-40"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-2 right-2 bg-black/30 p-2 rounded-full"
            onPress={() => removeFromWishlist(item._id)}
          >
            <Ionicons name="heart" size={22} color="#ff4081" />
          </TouchableOpacity>
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <Text className="text-white text-lg font-bold">{item.title}</Text>
          </View>
        </View>
        
        <View className="p-3">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="#624cf5" />
              <Text className="text-gray-600 ml-1">
                {formatDate(item.startDateTime)}
              </Text>
            </View>
            <Text className="font-semibold text-[#624cf5]">₹{item.price}</Text>
          </View>
          
          <Text className="text-gray-600 text-sm" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#624cf5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Wishlist" />
      
      <FlatList
        data={wishlistedEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#624cf5"]}
            tintColor="#624cf5"
          />
        }
      />
    </View>
  );
}