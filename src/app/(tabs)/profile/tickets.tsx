import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native";
import Header from "@/components/Header";
import { Calendar, Clock, MapPin } from "lucide-react-native";

const TicketsScreen = () => {
  const upcomingTickets = [
    {
      id: 1,
      eventName: "Kids Business Fest",
      date: "March 1, 2025",
      time: "11:00 AM",
      location: "Bestech Park View",
      imageUrl:
        "https://utfs.io/f/b674ee57-d004-4302-a458-456ff196e13a-ng6bfi.jpg.webp",
      ticketCode: "TKT123456",
    },
    {
      id: 2,
      eventName: "Robotics Workshop",
      date: "February 25, 2025",
      time: "2:30 PM",
      location: "Parsvnath Exotica",
      imageUrl:
        "https://utfs.io/f/a6fc5c10-472b-42d9-b4da-f3e831c12af5-m57ly8.webp",
      ticketCode: "TKT789012",
    },
  ];

  const renderTicket = ({ item }) => (
    <View className="bg-white rounded-xl mx-4 mb-4 overflow-hidden border border-gray-100">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-40"
        style={{ backgroundColor: "#f0f0f0" }}
      />
      <View className="p-4">
        <Text className="text-lg font-semibold">{item.eventName}</Text>
        <View className="flex-row items-center mt-2">
          <Calendar size={16} color="#624cf5" />
          <Text className="ml-2 text-gray-600">{item.date}</Text>
        </View>
        <View className="flex-row items-center mt-2">
          <Clock size={16} color="#624cf5" />
          <Text className="ml-2 text-gray-600">{item.time}</Text>
        </View>
        <View className="flex-row items-center mt-2">
          <MapPin size={16} color="#624cf5" />
          <Text className="ml-2 text-gray-600">{item.location}</Text>
        </View>
        <View className="mt-4 pt-4 border-t border-gray-100">
          <Text className="text-sm text-gray-500">Ticket Code</Text>
          <Text className="text-base font-medium text-[#624cf5]">
            {item.ticketCode}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <Header title="My Tickets" />
      <FlatList
        data={upcomingTickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 16 }}
      />
    </SafeAreaView>
  );
};

export default TicketsScreen;
