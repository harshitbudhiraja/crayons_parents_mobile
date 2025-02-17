import {
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import TicketCard from "@/components/Ticket";
import { useAuth, useUser } from "@clerk/clerk-expo";

// Types for our ticket data
interface Child {
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date;
}

interface Event {
  _id: string;
  title: string;
  imageUrl: string;
}

interface ITicketItem {
  _id: string;
  event: Event;
  totalAmount: number;
  createdAt: string;
  child: Child;
}

const TicketsScreen = () => {
  const { user } = useUser();
  const [tickets, setTickets] = useState<ITicketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchTickets = async () => {
      if (!user.publicMetadata.userId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/tickets/user?userId=${user.publicMetadata.userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isSubscribed) {
          setTickets(data);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : 'Failed to load tickets');
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchTickets();

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isSubscribed = false;
    };
  }, [user.publicMetadata.userId]); // Re-fetch when userId changes

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <Header title="My Tickets" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <Header title="My Tickets" />
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center">
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <Header title="My Tickets" />
      {tickets.length > 0 ? (
        <FlatList
          data={tickets}
          renderItem={({ item }) => (
            <TicketCard ticket={item} />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-500 text-center">
            No tickets found. Book an event to see your tickets here.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TicketsScreen;