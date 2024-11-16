import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function MemoryDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const memory = route.params?.memory;

  return (
    <SafeAreaView className="flex-1  bg-[#1A1A1A]">
      <StatusBar style="light" />

      {/* Header */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-12 left-0 right-0 z-10 px-6 py-4"
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("memory")}
          className="bg-black/40 p-1 rounded-full w-10 h-10 items-center justify-center"
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      </MotiView>

      <ScrollView className="flex-1">
        {/* Full-width Image Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {memory?.images.map((image: string, index: number) => (
            <View key={index} className="w-full items-center justify-center">
              <Image
                key={index}
                source={{ uri: image }}
                style={{ width, height: 400 }}
                contentFit="contain"
                recyclingKey={memory._id + index}
              />
            </View>
          ))}
        </ScrollView>

        {/* Content */}
        <MotiView
          from={{ translateY: 100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: "spring", delay: 300 }}
          className="px-6 pt-6"
        >
          <Text className="text-3xl font-bold text-white mb-2">
            {memory?.title}
          </Text>

          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Feather name="user" size={16} color="#999" />
              <Text className="text-gray-400 ml-2">{memory?.author}</Text>
            </View>
            <Text className="text-gray-400">
              {new Date(memory?.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* Content with paragraph formatting */}
          {memory?.content
            .split("\n")
            .map((paragraph: string, index: number) => (
              <MotiView
                key={index}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 400 + index * 100 }}
              >
                <Text className="text-gray-300 text-lg leading-relaxed mb-4">
                  {paragraph}
                </Text>
              </MotiView>
            ))}

          {/* Tags Section */}
          <View className="flex-row flex-wrap gap-2 mt-4 mb-8">
            <View className="bg-gray-800 px-3 py-1 rounded-full">
              <Text className="text-gray-300">Memory</Text>
            </View>
            <View className="bg-gray-800 px-3 py-1 rounded-full">
              <Text className="text-gray-300">Story</Text>
            </View>
          </View>
        </MotiView>
      </ScrollView>

      {/* Bottom Actions */}
      <MotiView
        from={{ translateY: 50 }}
        animate={{ translateY: 0 }}
        className="flex-row items-center justify-around py-4 px-6 border-t border-gray-800"
      >
        <TouchableOpacity className="flex-row items-center space-x-1">
          <Feather name="heart" size={24} color="white" />
          <Text className="text-white ml-1">Like</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center space-x-1">
          <Feather name="share-2" size={24} color="white" />
          <Text className="text-white ml-1">Share</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center space-x-1">
          <Feather name="bookmark" size={24} color="white" />
          <Text className="text-white ml-1">Save</Text>
        </TouchableOpacity>
      </MotiView>
    </SafeAreaView>
  );
}
