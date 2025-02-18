import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth(); 

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/login"} />;
  }

  return <Slot />;
}
