// app/(tabs)/events/[eventId]/checkout.tsx

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import RazorpayCheckout from "react-native-razorpay";
import { useUser } from "@clerk/clerk-expo";

interface Child {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Address {
  street: string;
  city: string;
}

interface Event {
  _id: string;
  title: string;
  price: number;
  startDateTime: string;
  imageUrl: string;
  address: Address;
}

const Checkout = () => {
  const router = useRouter();
  const { user } = useUser();
  const { eventId } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isChildSelectOpen, setIsChildSelectOpen] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/events/${eventId}`
        );
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event details");
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // Fetch children (assuming you have userId stored somewhere)
  const fetchChildren = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/child?userId=${user.publicMetadata.userId}`
      );
      const childrenData = await response.json();
      setChildren(childrenData?.data);
      setError("");
    } catch (error) {
      console.error("Error fetching children:", error);
      setError("Failed to load children");
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const handleChildSelection = (childId: string) => {
    setSelectedChildren((prev) => {
      if (prev.includes(childId)) {
        return prev.filter((id) => id !== childId);
      } else {
        return [...prev, childId];
      }
    });
  };

  const calculatePrices = () => {
    if (!event) return { basePrice: 0, gstAmount: 0, totalAmount: 0 };

    const basePrice = Number(event.price) * selectedChildren.length;
    const gstRate = 0.18;
    const gstAmount = Number((basePrice * gstRate).toFixed(2));
    const totalAmount = basePrice + gstAmount;

    return {
      basePrice,
      gstAmount,
      totalAmount,
    };
  };

  const handlePayment = async () => {
    if (!event) return;

    const { totalAmount } = calculatePrices();

    if (!user?.publicMetadata?.userId) {
      setError("User ID not found");
      return;
    }

    useEffect(() => {
      const testAPI = async () => {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/api/health-check`
          );
          console.log("API Status:", response.status);
        } catch (error) {
          console.error("API Connection Error:", error);
        }
      };

      testAPI();
    }, []);

    try {
      setIsProcessingOrder(true);

      // Create order in your backend
      const orderResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: event._id,
            totalAmount,
            buyer: user.publicMetadata.userId,
            status: "PENDING",
            children: selectedChildren,
          }),
        }
      );

      const orderData = await orderResponse.json();

      // Initialize Razorpay payment
      const options = {
        description: `Tickets for ${event.title} (${selectedChildren.length} children)`,
        image: event.imageUrl,
        currency: "INR",
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        name: event.title,
        order_id: orderData.razorpayOrderId,
        theme: { color: "#624cf5" },
      };

      const paymentData = await RazorpayCheckout.open(options);

      if (paymentData.razorpay_payment_id) {
        // Update order status
        await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/orders/${orderData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "SUCCESS",
              razorpayPaymentId: paymentData.razorpay_payment_id,
            }),
          }
        );

        // Navigate to confirmation screen
        router.push(
          `/confirmation?status=success&eventTitle=${event.title}&payment_id=${paymentData.razorpay_payment_id}`
        );
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessingOrder(false);
      setIsCheckoutModalOpen(false);
    }
  };

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#624cf5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

      {/* Processing Order Overlay */}
      <Modal visible={isProcessingOrder} transparent>
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-white p-6 rounded-lg items-center m-4">
            <ActivityIndicator size="large" color="#624cf5" />
            <Text className="text-gray-600 mt-4">Processing your order...</Text>
          </View>
        </View>
      </Modal>

      {/* Child Selection Modal */}
      <Modal visible={isChildSelectOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold">Select Children</Text>
              <TouchableOpacity onPress={() => setIsChildSelectOpen(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-96">
              {children.map((child) => (
                <TouchableOpacity
                  key={child._id}
                  onPress={() => handleChildSelection(child._id)}
                  className="flex-row items-center p-4 border-b border-gray-200"
                >
                  <Text className="flex-1">{`${child.firstName} ${child.lastName}`}</Text>
                  {selectedChildren.includes(child._id) && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#624cf5"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Checkout Modal */}
      <Modal visible={isCheckoutModalOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold">Order Summary</Text>
              <TouchableOpacity onPress={() => setIsCheckoutModalOpen(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View className="bg-gray-50 p-4 rounded-lg mb-4">
              <Text className="font-semibold text-lg">{event.title}</Text>
              <Text className="text-gray-500">
                {new Date(event.startDateTime).toLocaleDateString()}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="font-medium mb-2">Selected Children</Text>
              {children
                .filter((child) => selectedChildren.includes(child._id))
                .map((child) => (
                  <Text key={child._id} className="text-gray-600 mb-1">
                    {`${child.firstName} ${child.lastName}`}
                  </Text>
                ))}
            </View>

            <View className="mb-6">
              <Text className="font-medium mb-2">Price Details</Text>
              {(() => {
                const { basePrice, gstAmount, totalAmount } = calculatePrices();
                return (
                  <View className="space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Base Price</Text>
                      <Text>₹{basePrice}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">GST (18%)</Text>
                      <Text>₹{gstAmount}</Text>
                    </View>
                    <View className="h-[1px] bg-gray-200 my-2" />
                    <View className="flex-row justify-between">
                      <Text className="font-semibold">Total Amount</Text>
                      <Text className="font-semibold">₹{totalAmount}</Text>
                    </View>
                  </View>
                );
              })()}
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setIsCheckoutModalOpen(false)}
                className="flex-1 p-4 border border-gray-200 rounded-lg items-center"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePayment}
                disabled={isLoading}
                className="flex-1 p-4 bg-[#624cf5] rounded-lg items-center"
              >
                <Text className="text-white font-semibold">
                  {isLoading ? "Processing..." : "Confirm Order"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <View className="space-y-4">
        <TouchableOpacity
          onPress={() => setIsChildSelectOpen(true)}
          className="border border-gray-200 rounded-lg p-4 flex-row justify-between items-center"
        >
          <Text className="text-gray-700">
            {selectedChildren.length > 0
              ? `${selectedChildren.length} children selected`
              : "Select children"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {selectedChildren.length > 0 && (
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-gray-600">
              Selected: {selectedChildren.length}{" "}
              {selectedChildren.length === 1 ? "child" : "children"}
            </Text>
            <Text className="font-semibold mt-1">
              Total: ₹{calculatePrices().totalAmount}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            if (selectedChildren.length === 0) {
              setError("Please select at least one child");
              return;
            }
            setError("");
            setIsCheckoutModalOpen(true);
          }}
          disabled={isLoading}
          className="bg-[#624cf5] p-4 rounded-lg items-center"
        >
          <Text className="text-white font-semibold">
            {isLoading
              ? "Processing..."
              : `Book ${selectedChildren.length || ""} Ticket${
                  selectedChildren.length !== 1 ? "s" : ""
                }`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Checkout;
