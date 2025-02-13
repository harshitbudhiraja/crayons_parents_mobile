import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native";
import Header from "@/components/Header";
import { CreditCard, Trash2 } from "lucide-react-native";

const PaymentMethodsScreen = () => {
  const paymentMethods = [
    {
      id: 1,
      type: "VISA",
      last4: "4242",
      expiry: "12/25",
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiry: "08/26",
    },
  ];

  const renderPaymentMethod = ({ item }) => (
    <View className="flex-row items-center bg-white p-4 border-b border-gray-100">
      <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center">
        <CreditCard size={24} color="#624cf5" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-base font-semibold">
          {item.type} ending in {item.last4}
        </Text>
        <Text className="text-gray-500">Expires {item.expiry}</Text>
      </View>
      <TouchableOpacity>
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <Header title="Payment Methods" />
      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <TouchableOpacity className="m-4 bg-[#624cf5] py-3 rounded-xl">
            <Text className="text-white text-center font-medium">
              Add New Payment Method
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default PaymentMethodsScreen;
