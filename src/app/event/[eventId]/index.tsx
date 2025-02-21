import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import useHttpHook from "@/hooks/useHttpHook";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

// Define types for better type safety
interface Address {
  street: string;
  city: string;
}

interface Instructor {
  name: string;
  imageUrl: string;
  description: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  overview: string;
  imageUrl: string;
  startDateTime: string;
  endDateTime: string;
  price: number;
  address: Address;
  instructor: Instructor;
  isWishlisted?: boolean;
}

// Text truncation component
const TruncatedText = ({
  text,
  limit,
  className,
}: {
  text: string;
  limit: number;
  className?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > limit;

  const displayText = isExpanded ? text : text.slice(0, limit);
  const showReadMore = shouldTruncate && !isExpanded;
  const showReadLess = shouldTruncate && isExpanded;

  return (
    <View>
      <Text className={className}>
        {displayText}
        {showReadMore && "..."}
      </Text>
      {(showReadMore || showReadLess) && (
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className="mt-1"
        >
          <Text className="text-[#624cf5] font-semibold">
            {showReadMore ? "Read More" : "Read Less"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function EventDetails() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { isLoading, error, fetchData } = useHttpHook();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const getEventDetails = async () => {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        // Fetch event details
        const event = await fetchData(
          process.env.EXPO_PUBLIC_API_URL + `/events/${eventId}`
        );
        setEventData(event);
        
        // Check if event is already wishlisted
        if (user?.publicMetadata?.userId) {
          const userId = user.publicMetadata.userId as string;
          const wishlistStatus = await fetchData(
            `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/wishlist/status?eventId=${eventId}`
          );
          setIsWishlisted(wishlistStatus?.isWishlisted || false);
        }
      } catch (err) {
        console.error("Failed to fetch event details:", err);
      }
    };

    getEventDetails();
  }, [eventId, user]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleWishlist = async () => {
    if (!user || isTogglingWishlist) return;

    const userId = user.publicMetadata.userId as string;
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    setIsTogglingWishlist(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/wishlist`,
        {
          method: isWishlisted ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId,
          }),
        }
      );

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
      } else {
        console.error("Failed to update wishlist");
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#624cf5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center">
          Error loading event details. Please try again.
        </Text>
        <TouchableOpacity
          className="mt-4 bg-gray-200 p-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!eventData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Event not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="relative">
            <Image
              source={{ uri: eventData.imageUrl }}
              className="w-full h-80"
              resizeMode="cover"
            />

            {/* Gradient overlay for buttons */}
            <View className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />

            {/* Back button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-6 left-4 bg-black/30 p-2 rounded-full"
              style={styles.iconButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Wishlist button */}
            <TouchableOpacity
              onPress={toggleWishlist}
              className="absolute top-6 right-4 bg-black/30 p-2 rounded-full"
              style={styles.iconButton}
              disabled={isTogglingWishlist}
            >
              {isTogglingWishlist ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons
                  name={isWishlisted ? "heart" : "heart-outline"}
                  size={24}
                  color={isWishlisted ? "#ff4081" : "white"}
                />
              )}
            </TouchableOpacity>
          </View>

          <View className="px-4 -mt-4 bg-white rounded-t-3xl">
            <Text className="text-2xl font-bold mt-6 mb-2">
              {eventData.title}
            </Text>
            <TruncatedText
              text={eventData.description}
              limit={150}
              className="text-gray-600 mb-4"
            />

            <View className="mb-6 space-y-3">
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#624cf5"
                  className="mr-2"
                />
                <Text className="ml-2 text-gray-700">
                  {formatDate(eventData.startDateTime)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#624cf5"
                  className="mr-2"
                />
                <Text className="ml-2 text-gray-700">
                  {formatTime(eventData.startDateTime)} -{" "}
                  {formatTime(eventData.endDateTime)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#624cf5"
                  className="mr-2"
                />
                <Text className="ml-2 text-gray-700">
                  {eventData.address.street}, {eventData.address.city}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color="#624cf5"
                  className="mr-2"
                />
                <Text className="ml-2 text-gray-700 font-semibold">
                  ₹{eventData.price}
                </Text>
              </View>
            </View>

            <Text className="text-lg font-semibold mb-2">Event Overview</Text>
            <TruncatedText
              text={eventData.overview}
              limit={300}
              className="text-gray-700 mb-6"
            />

            <View className="bg-gray-50 p-4 rounded-xl mb-6 shadow-sm">
              <View className="flex-row items-center mb-2">
                <Image
                  source={{ uri: eventData.instructor.imageUrl }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View>
                  <Text className="font-bold text-base">
                    {eventData.instructor.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Event Instructor
                  </Text>
                </View>
              </View>
              <TruncatedText
                text={eventData.instructor.description}
                limit={200}
                className="text-gray-700 mt-2"
              />
            </View>

            <TouchableOpacity
              className="bg-[#624cf5] p-4 rounded-xl items-center mb-8"
              onPress={() => router.push(`/event/${eventId}/checkout`)}
            >
              <Text className="text-white font-bold text-base">
                Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});