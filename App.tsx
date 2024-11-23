import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import Memory from "./screen/Memory";
import "./global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import Intro from "./screen/Intro";
import { useFonts } from "expo-font";
import AddMemory from "./screen/addMemory";
import MemoryDetails from "./screen/MemoryDetail";
import { MemoryProvider } from "./context/memoryContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Platform } from "react-native";
import profile from "./screen/profile/profile";
import Login from "./screen/auth/Login";
import Auth from "./screen/auth/Login";
import { UserContextProvider, useUserContext } from "./context/userContext";
import setupProfile from "./screen/profile/setupProfile";
import EditMemory from "./screen/editMemory";
import specialPage from "./screen/specialPage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useFonts({
    Doto: require("./assets/fonts/Doto.ttf"),
    Edu: require("./assets/fonts/Edu.ttf"),
    Geist: require("./assets/fonts/Geist.ttf"),
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <UserContextProvider>
          <MemoryProvider>
            <Layout />
          </MemoryProvider>
        </UserContextProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const SplashScreen = () => {
  return (
    <SafeAreaView className="bg-[#1A1A1A] flex-1 justify-center items-center">
      <StatusBar style="light" />
      <View>
        <Text
          style={{
            fontSize: 40,
            color: "white",
            fontWeight: "500",
            fontFamily: "Doto",
          }}
        >
          Memories
        </Text>
      </View>
    </SafeAreaView>
  );
};
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="addmemory"
        component={AddMemory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="editmemory"
        component={EditMemory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="memorydetails"
        component={MemoryDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Bottom tabs for main navigation
const MainTabs = () => {
  const { user } = useUserContext();

  return (
    <Stack.Navigator
      initialRouteName={user.bio == "" ? "setupprofile" : "memory"}
    >
      <Stack.Screen
        name="memory"
        component={Memory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="setupprofile"
        component={setupProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="profile"
        component={profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Separate stack for authentication flow
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro" component={Intro} />
      <Stack.Screen name="special" component={specialPage} />
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
};

// Setup profile stack (shown after authentication but before main app)
// const SetupStack = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}></Stack.Navigator>
//   );
// };

export const Layout = () => {
  const { user } = useUserContext(); // Add isProfileSetup to your context

  return (
    <View style={{ flex: 1, backgroundColor: "#1A1A1A" }}>
      <StatusBar style="light" />
      {!user ? <AuthStack /> : <MainStack />}
    </View>
  );
};
