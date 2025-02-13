import { View, Text, Image, TouchableOpacity, SafeAreaView, FlatList, StatusBar } from "react-native";
import Header from "@/components/Header";
import { Trash2 } from "lucide-react-native";

const SavedEventsScreen = () => {
    const savedEvents = [
      {
        id: 1,
        name: "Impromptu Storytelling",
        date: "March 2, 2025",
        price: "₹499",
        imageUrl: "https://utfs.io/f/e3096799-86d5-4968-9e06-a7171bd21cee-1nq2cb.jpeg",
      },
      {
        id: 2,
        name: "Kids Business Fest",
        date: "March 1, 2025",
        price: "₹799",
        imageUrl: "https://utfs.io/f/b674ee57-d004-4302-a458-456ff196e13a-ng6bfi.jpg.webp",
      },
    ];
  
    const renderSavedEvent = ({ item }) => (
      <View className="flex-row bg-white p-4 border-b border-gray-100">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-20 h-20 rounded-lg"
          style={{ backgroundColor: "#f0f0f0" }}
        />
        <View className="flex-1 ml-4">
          <Text className="text-base font-semibold">{item.name}</Text>
          <Text className="text-gray-600 mt-1">{item.date}</Text>
          <Text className="text-[#624cf5] font-medium mt-1">{item.price}</Text>
        </View>
        <TouchableOpacity className="justify-center">
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <Header title="Saved Events" />
        <FlatList
          data={savedEvents}
          renderItem={renderSavedEvent}
          keyExtractor={(item) => item.id.toString()}
        />
      </SafeAreaView>
    );
  };

  export default SavedEventsScreen;