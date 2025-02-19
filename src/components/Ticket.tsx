import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { CalendarDays, Clock, User } from "lucide-react-native";
import { formatDateTime } from "@/lib/utils";

// Types
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

interface TicketCardProps {
  ticket: ITicketItem;
}

const calculateAge = (dob: Date) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const TicketCard = ({ ticket }: TicketCardProps) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mx-4 mb-4 overflow-hidden shadow-sm"
      onPress={() => router.push(`profile/ticket/${ticket._id}`)}
      activeOpacity={0.7}
    >
      <View className="relative">
        <Image
          source={{ uri: ticket.event.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <View className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Ticket Badge */}
        <View className="absolute bottom-3 left-3">
          <View className="px-3 py-1 bg-primary-500/80 rounded-full">
            <Text className="text-white text-sm font-semibold">Ticket</Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        {/* Title and Price Row */}
        <View className="flex-row justify-between items-start mb-3">
          <TouchableOpacity
            className="flex-1 mr-2"
            onPress={() => router.push(`/events/${ticket.event._id}`)}
          >
            <Text className="text-lg font-bold text-gray-800" numberOfLines={2}>
              {ticket.event.title}
            </Text>
          </TouchableOpacity>
          <View className="bg-primary-50 px-4 py-1.5 rounded-full">
            <Text className="text-primary-600 font-semibold">
              ₹{ticket.totalAmount}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View className="space-y-2 mb-4">
          <View className="flex-row items-center">
            <CalendarDays size={16} color="#624cf5" className="opacity-70" />
            <Text className="ml-2 text-sm text-gray-600">
              {formatDateTime(new Date(ticket.createdAt)).dateTime}
            </Text>
          </View>

          <View className="flex-row items-center">
            <User size={16} color="#624cf5" className="opacity-70" />
            <Text className="ml-2 text-sm text-gray-600">
              {ticket.child?.firstName} {ticket.child?.lastName}
              <Text className="text-gray-500">
                {" "}
                ({ticket.child?.gender}, {calculateAge(ticket.child?.dob)}{" "}
                years)
              </Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">
              Status: <Text className="text-green-700">Booked</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/ticket/${ticket._id}`)}
          >
            <Text className="text-primary-500 font-semibold text-sm">
              GET INFO
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TicketCard;
