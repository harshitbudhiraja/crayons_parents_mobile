import "../global.css";
import { tokenCache } from "cache";
import { Slot } from "expo-router";
import { Platform, SafeAreaView, View } from "react-native";
import Navigation from "@/components/Navigation";
import { ClerkLoaded, ClerkProvider, SignedIn } from "@clerk/clerk-expo";
import "react-native-gesture-handler";
import { StatusBar } from "react-native";
export default function Layout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <SafeAreaView
          className="flex-1 bg-white"
          style={{
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          <StatusBar
            translucent={true}
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          {/* Rest of your code */}
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Slot />
            </View>
            <SignedIn>
              <Navigation />
            </SignedIn>
          </View>
        </SafeAreaView>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
