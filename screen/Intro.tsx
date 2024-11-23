import { Text, TouchableOpacity, View, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { height } = Dimensions.get("window");

type AuthStackParamList = {
  login: undefined;
  special: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function Intro() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A1A]">
      <StatusBar style="light" />

      {/* Background Image with Gradient Overlay */}
      <Image
        source={require("../assets/memories-bg.jpg")}
        style={{ position: "absolute", width: "100%", height: height }}
        contentFit="cover"
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "#1A1A1A"]}
        style={{ position: "absolute", width: "100%", height: height }}
      />
      {/* Content Container */}
      <View className="flex-1 justify-between px-6">
        {/* Top Section */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 1000 }}
          className="mt-20"
        >
          <Text className="text-white text-2xl" style={{ fontFamily: "Doto" }}>
            Welcome to
          </Text>
        </MotiView>

        {/* Middle Section */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 1500 }}
          className="space-y-4"
        >
          <Text
            style={{
              color: "white",
              fontFamily: "Doto",
              fontSize: 70,
              fontWeight: "600",
            }}
          >
            Memories
          </Text>

          <Text
            style={{ fontFamily: "Doto" }}
            className="text-white/90 text-md"
          >
            Capture and preserve your precious moments in a beautiful digital
            journal. Start your memory collection today.
          </Text>

          {/* <Text className="text-gray-400 text-base mt-4 leading-relaxed">
            Capture and preserve your precious moments in a beautiful digital
            journal. Start your memory collection today.
          </Text> */}
        </MotiView>

        {/* Bottom Section */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", delay: 1000 }}
          className="mb-12 space-y-4"
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("login")}
            className="bg-white py-4 mb-4 rounded-full"
          >
            <Text className="text-black text-center font-semibold text-lg">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("special")}
            className="py-4 flex-row items-center justify-center"
          >
            <Text className="text-white/70 text-center">
              For a special someone..
            </Text>
            <Text className="text-cyan-700/70 text-center">click here</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </SafeAreaView>
  );
}
