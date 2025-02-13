import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native";
import Header from "@/components/Header";
import { Calendar, Clock } from "lucide-react-native";

const EventsScreen = () => {
  const myEvents = [
    {
      id: 1,
      status: "upcoming",
      events: [
        {
          id: 101,
          name: "Mini Architect Workshop",
          date: "March 9, 2025",
          time: "10:00 AM",
          imageUrl:
            "https://utfs.io/f/462d135e-502d-4a8c-9312-6180708c0a59-oxh7fs.webp",
        },
      ],
    },
    {
      id: 2,
      status: "past",
      events: [
        {
          id: 201,
          name: "Real Life - Role Plays",
          date: "February 18, 2025",
          time: "3:30 PM",
          imageUrl:
            "https://utfs.io/f/390abd2e-8959-4105-a3c4-42d6b8a06a5d-wszwhu.jpeg",
        },
      ],
    },
  ];

  const renderEvent = ({ item }) => (
    <View className="mt-4">
      <Text className="px-4 text-lg font-semibold capitalize mb-2">
        {item.status} Events
      </Text>
      {item.events.map((event) => (
        <View
          key={event.id}
          className="flex-row bg-white p-4 border-b border-gray-100"
        >
          <Image
            source={{ uri: event.imageUrl }}
            className="w-20 h-20 rounded-lg"
            style={{ backgroundColor: "#f0f0f0" }}
          />
          <View className="flex-1 ml-4">
            <Text className="text-base font-semibold">{event.name}</Text>
            <View className="flex-row items-center mt-2">
              <Calendar size={16} color="#624cf5" />
              <Text className="ml-2 text-gray-600">{event.date}</Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Clock size={16} color="#624cf5" />
              <Text className="ml-2 text-gray-600">{event.time}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <Header title="My Events" />
      <FlatList
        data={myEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default EventsScreen;
