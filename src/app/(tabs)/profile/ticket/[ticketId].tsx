import { View, ActivityIndicator, Text } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import TicketDetails from "@/components/TicketDetails";

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface Instructor {
  name: string;
  description: string;
  imageUrl: string;
  url: string;
}

interface AgeRange {
  min: number;
  max: number;
  _id: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Organizer {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  overview: string;
  locationType: "In-Person" | "Online" | "To-Be-Decided";
  address: Address;
  instructor: Instructor;
  ageRange: AgeRange;
  imageUrl: string;
  startDateTime: string;
  endDateTime: string;
  price: string;
  isFree: boolean;
  category: Category;
  organizer: Organizer;
  no_of_tickets: number;
  createdAt: string;
}

interface Ticket {
  _id: string;
  orderId: string;
  totalAmount: number;
  event: Event;
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  child: {
    _id: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    parent_id: string;
  };
  createdAt: string;
}

export default function TicketScreen() {
  const { ticketId } = useLocalSearchParams();
  const { userId } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/tickets/${ticketId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch ticket details');
        }

        const data = await response.json();

        if (isSubscribed) {
          // Convert date strings to Date objects where needed
          const ticketWithDates = {
            ...data,
            event: {
              ...data.event,
              startDateTime: new Date(data.event.startDateTime),
              endDateTime: new Date(data.event.endDateTime),
            },
            child: {
              ...data.child,
              dob: new Date(data.child.dob),
            },
            createdAt: new Date(data.createdAt),
          };
          setTicket(ticketWithDates);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : 'Failed to load ticket details');
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    if (ticketId) {
      fetchTicket();
    }

    return () => {
      isSubscribed = false;
    };
  }, [ticketId]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-red-500 text-center">
          {error}
        </Text>
      </View>
    );
  }

  if (!ticket) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-gray-500 text-center">
          Ticket not found
        </Text>
      </View>
    );
  }

  return <TicketDetails ticket={ticket} userId={userId as string} />;
}