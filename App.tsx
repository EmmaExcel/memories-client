import { NavigationContainer, useNavigation } from "@react-navigation/native";
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

const Tab = createBottomTabNavigator();

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  useFonts({
    Doto: require("./assets/fonts/Doto.ttf"),
    Edu: require("./assets/fonts/Edu.ttf"),
    Geist: require("./assets/fonts/Geist.ttf"),
    Pacifico: require("./assets/fonts/Pacifico.ttf"),
  });

  return (
    <SafeAreaView className="bg-black flex-1 justify-center items-center">
      <StatusBar style="dark" />
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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  useFonts({
    Doto: require("./assets/fonts/Doto.ttf"),
    Edu: require("./assets/fonts/Edu.ttf"),
    Geist: require("./assets/fonts/Geist.ttf"),
    Pacifico: require("./assets/fonts/Pacifico.ttf"),
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="intro"
          component={Intro}
          options={{
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
          }}
        />
        <Tab.Screen
          name="memory"
          component={Memory}
          options={{
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
          }}
        />
        <Tab.Screen
          name="addmemory"
          component={AddMemory}
          options={{
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
          }}
        />
        <Tab.Screen
          name="memorydetails"
          component={MemoryDetails}
          options={{
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
