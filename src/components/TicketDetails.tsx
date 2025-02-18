import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MapPin, Globe, Clock, ChevronLeft, Calendar, User, FileText, Download, ExternalLink } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import { formatDateTime } from "@/lib/utils";

interface TicketDetailsProps {
  ticket: {
    _id: string;
    event: {
      _id: string;
      title: string;
      startDateTime: string;
      locationType: string;
      address?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
      imageUrl: string;
    };
    buyer: {
      _id: string;
    };
    child?: {
      firstName: string;
      lastName: string;
      gender: string;
      dob: string;
    };
    totalAmount: number;
    createdAt: string;
    orderId: string;
  };
  userId: string;
}

const TicketDetails = ({ ticket, userId }: TicketDetailsProps) => {
  const isOwner = ticket.buyer._id === userId;
  const eventDate = new Date(ticket.event.startDateTime);
  
  const dayOfWeek = eventDate.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const renderLocationInfo = () => {
    if (ticket.event.locationType === "Online") {
      return (
        <View className="flex-row items-center space-x-3 bg-blue-50 rounded-xl p-4">
          <View className="bg-blue-100 p-2 rounded-lg">
            <Globe size={20} color="#1D4ED8" />
          </View>
          <View>
            <Text className="font-semibold text-blue-900">Online Event</Text>
            <Text className="text-sm text-blue-700">Join link will be shared before the event</Text>
          </View>
        </View>
      );
    }

    if (ticket.event.locationType === "In-Person" && ticket.event.address) {
      return (
        <View className="flex-row items-start space-x-3 bg-green-50 rounded-xl p-4">
          <View className="bg-green-100 p-2 rounded-lg">
            <MapPin size={20} color="#047857" />
          </View>
          <View>
            <Text className="font-semibold text-green-900">In-Person Event</Text>
            <Text className="text-sm text-green-800 mt-1">{ticket.event.address.street}</Text>
            <Text className="text-sm text-green-700">
              {ticket.event.address.city}, {ticket.event.address.state} {ticket.event.address.postalCode}
            </Text>
            <Text className="text-sm text-green-700">{ticket.event.address.country}</Text>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-row items-center space-x-3 bg-yellow-50 rounded-xl p-4">
        <View className="bg-yellow-100 p-2 rounded-lg">
          <Clock size={20} color="#92400E" />
        </View>
        <View>
          <Text className="font-semibold text-yellow-900">Location To Be Decided</Text>
          <Text className="text-sm text-yellow-700">Details will be announced soon</Text>
        </View>
      </View>
    );
  };

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-row items-center mb-2"
        >
          <ChevronLeft size={24} color="#4B5563" />
          <Text className="text-gray-600 ml-1">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">
          {ticket.event.title}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <View className="relative h-56 w-full">
          <Image
            source={{ uri: ticket.event.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        </View>

        {/* Content */}
        <View className="p-4 space-y-6">
          {/* Ticket Status Card */}
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="items-center mb-6">
              <QRCode
                value={`https://crayons.co.in/tickets/${ticket._id}`}
                size={180}
                logoBackgroundColor="white"
              />
              <Text className="text-sm text-gray-500 mt-3 font-medium">
                Scan QR code for verification
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-4 border-t border-gray-100">
              <View>
                <Text className="text-sm text-gray-500 mb-1">Ticket ID</Text>
                <Text className="font-mono text-sm text-gray-700">
                  {ticket._id.toUpperCase()}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-sm text-gray-500 mb-1">Amount Paid</Text>
                <Text className="text-2xl font-bold text-green-600">
                  ₹{ticket.totalAmount}
                </Text>
              </View>
            </View>
          </View>

          {/* Event Details */}
          <View className="space-y-4">
            {/* Location */}
            {renderLocationInfo()}

            {/* Date and Time */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-4">
                <Calendar size={20} color="#4B5563" />
                <Text className="ml-2 font-semibold text-gray-900">Date & Time</Text>
              </View>
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm text-gray-500">Day</Text>
                  <Text className="text-lg font-semibold text-gray-900">{dayOfWeek}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-500">Date</Text>
                  <Text className="text-lg font-semibold text-gray-900">{formattedDate}</Text>
                </View>
              </View>
            </View>

            {/* Attendee Details */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-4">
                <User size={20} color="#4B5563" />
                <Text className="ml-2 font-semibold text-gray-900">Attendee Details</Text>
              </View>
              <View className="space-y-2">
                <Text className="text-lg font-semibold text-gray-900">
                  {ticket.child?.firstName} {ticket.child?.lastName}
                </Text>
                <Text className="text-gray-600">
                  {ticket.child?.gender} • {calculateAge(ticket.child?.dob)} years old
                </Text>
              </View>
            </View>

            {/* Order Information */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-4">
                <FileText size={20} color="#4B5563" />
                <Text className="ml-2 font-semibold text-gray-900">Order Information</Text>
              </View>
              <View className="space-y-3">
                <View>
                  <Text className="text-sm text-gray-500">Order Date</Text>
                  <Text className="text-gray-900">{formatDateTime(new Date(ticket.createdAt)).dateTime}</Text>
                </View>
                <View>
                  <Text className="text-sm text-gray-500">Order ID</Text>
                  <Text className="font-mono text-gray-900">{ticket.orderId}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {isOwner && (
            <View className="flex-row space-x-3 mt-4 mb-6">
              <TouchableOpacity
                className="flex-1 bg-primary-600 py-4 rounded-xl flex-row items-center justify-center space-x-2"
                onPress={() => router.push(`/events/${ticket.event._id}`)}
              >
                <ExternalLink size={20} color="white" />
                <Text className="text-white font-semibold">View Event</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-white border border-gray-200 py-4 rounded-xl flex-row items-center justify-center space-x-2"
                onPress={() => {
                  // Handle download ticket
                }}
              >
                <Download size={20} color="#4B5563" />
                <Text className="text-gray-700 font-semibold">Download</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TicketDetails;