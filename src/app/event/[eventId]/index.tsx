import { View, Image, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useEffect, useState } from "react";
import useHttpHook from "@/hooks/useHttpHook";
import { router } from "expo-router";
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
}

// Text truncation component
const TruncatedText = ({ 
  text, 
  limit, 
  className 
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

  useEffect(() => {
    const getEventDetails = async () => {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        const event = await fetchData(process.env.EXPO_PUBLIC_API_URL + `/events/${eventId}`);
        setEventData(event);
      } catch (err) {
        console.error('Failed to fetch event details:', err);
      }
    };

    getEventDetails();
  }, [eventId]);

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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading event details...</Text>
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
        <View className="flex-row items-center p-4 bg-white">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Event Details</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: eventData.imageUrl }}
            className="w-full h-64 rounded-lg mb-4"
            resizeMode="cover"
          />

          <View className="px-4">
            <Text className="text-2xl font-bold mb-2">{eventData.title}</Text>
            <TruncatedText 
              text={eventData.description} 
              limit={150}
              className="text-gray-600 mb-4"
            />

            <View className="mb-4 space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="#666" className="mr-2" />
                <Text className="ml-2">{formatDate(eventData.startDateTime)}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={20} color="#666" className="mr-2" />
                <Text className="ml-2">
                  {formatTime(eventData.startDateTime)} - {formatTime(eventData.endDateTime)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={20} color="#666" className="mr-2" />
                <Text className="ml-2">
                  {eventData.address.street}, {eventData.address.city}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="cash-outline" size={20} color="#666" className="mr-2" />
                <Text className="ml-2">₹{eventData.price}</Text>
              </View>
            </View>

            <Text className="text-lg font-semibold mb-2">Event Overview</Text>
            <TruncatedText 
              text={eventData.overview} 
              limit={300}
              className="text-gray-700 mb-4"
            />

            <View className="bg-gray-100 p-4 rounded-lg mb-4">
              <View className="flex-row items-center mb-2">
                <Image
                  source={{ uri: eventData.instructor.imageUrl }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View>
                  <Text className="font-bold">{eventData.instructor.name}</Text>
                  <Text className="text-gray-600 text-sm">Event Instructor</Text>
                </View>
              </View>
              <TruncatedText 
                text={eventData.instructor.description} 
                limit={200}
                className="text-gray-700 mt-2"
              />
            </View>

            <TouchableOpacity
              className="bg-[#624cf5] p-4 rounded-lg items-center mb-6"
              onPress={() => router.push(`/event/${eventId}/checkout`)}
            >
              <Text className="text-white font-bold">Register Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}