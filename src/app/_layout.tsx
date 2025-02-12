import "../global.css";
import { tokenCache } from "cache";
import { Slot } from "expo-router";
import { View } from "react-native";
import Navigation from "@/components/Navigation";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";

export default function Layout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Slot />
          </View>
          <Navigation />
        </View>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
