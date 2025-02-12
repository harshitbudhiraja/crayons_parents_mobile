import { View, Image, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

function Content() {
  const navigation = useNavigation();
  const eventData = {
    title: "Kids Business Fest",
    description:
      "Unlock your child's potential! A fun, hands-on event where kids run mini businesses, build skills & learn entrepreneurship. 🚀✨",
    overview:
      "Join us for a fun, hands-on event where kids explore entrepreneurship through engaging activities...",
    startDateTime: new Date("2025-03-01T05:30:00.000Z"),
    endDateTime: new Date("2025-03-01T08:30:00.000Z"),
    address: {
      street: "Bestech Park View Spa Society",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122018",
    },
    price: "799",
    instructor: {
      name: "Pawan Pagaria",
      description:
        "Pawan is the Founder & CEO of Neo Risers and a PhD researcher at IIT Delhi's Design Department...",
      imageUrl:
        "https://utfs.io/f/d276260c-0b45-4e17-b2bc-ef7c787fa5bd-gmsnig.png",
    },
    imageUrl:
      "https://utfs.io/f/b674ee57-d004-4302-a458-456ff196e13a-ng6bfi.jpg.webp",
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="p-4 flex-1">
      <View className="flex-row items-center p-4 bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
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

        <Text className="text-2xl font-bold mb-2">{eventData.title}</Text>
        <Text className="text-gray-600 mb-4">{eventData.description}</Text>

        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar" size={20} className="mr-2" />
            <Text>{formatDate(eventData.startDateTime)}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="time" size={20} className="mr-2" />
            <Text>
              {formatTime(eventData.startDateTime)} -{" "}
              {formatTime(eventData.endDateTime)}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={20} className="mr-2" />
            <Text>
              {eventData.address.street}, {eventData.address.city}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="cash" size={20} className="mr-2" />
            <Text>₹{eventData.price}</Text>
          </View>
        </View>

        <Text className="text-lg font-semibold mb-2">Event Overview</Text>
        <Text className="text-gray-700 mb-4">{eventData.overview}</Text>

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
          <Text className="text-gray-700 mt-2">
            {eventData.instructor.description}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-[#624cf5] p-4 rounded-lg items-center"
          onPress={() => {
            /* Handle registration logic */
          }}
        >
          <Text className="text-white font-bold">Register Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default Content;
