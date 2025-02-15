import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/login"} />;
  }

  return <Slot />;
}
