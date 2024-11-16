import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { Feather } from "@expo/vector-icons";
import { API_URL } from "../api";

const { width } = Dimensions.get("window");

export default function Memory() {
  const [isLoading, setIsLoading] = useState(true);
  const [memory, setMemory] = useState<any[]>([]);
  const navigation = useNavigation();

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL + "/memory");
      setMemory(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log("error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A1A]">
      <StatusBar style="light" />

      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="px-6 py-4 flex-row items-center justify-between"
      >
        <Text className="text-3xl font-bold text-white">Memories</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("addmemory")}
          className="bg-white/10 p-3 rounded-full"
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </MotiView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-2">
          {memory.map((item: any, index: number) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("memorydetails", { memory: item })
              }
            >
              <MotiView
                key={item._id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 100 }}
                className="mb-6 bg-[#252525] rounded-2xl overflow-hidden"
              >
                {/* Image Carousel */}
                <View className="w-full items-center justify-center px-1">
                  <Image
                    style={{
                      width: "100%",
                      height: 300,
                      borderRadius: 8,
                    }}
                    source={{ uri: item.images[0] }}
                    contentFit="contain"
                    recyclingKey={item._id}
                  />
                </View>

                {/* Content */}
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-xl font-bold text-white">
                      {item.title}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>

                  <Text className="text-gray-300 mb-3 leading-relaxed line-clamp-3">
                    {item.content}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Feather name="user" size={16} color="#999" />
                      <Text className="text-gray-400 ml-2">{item.author}</Text>
                    </View>

                    <TouchableOpacity className="flex-row items-center">
                      <Text className="text-cyan-400 mr-1">Read More</Text>
                      <Feather name="chevron-right" size={16} color="#22d3ee" />
                    </TouchableOpacity>
                  </View>
                </View>
              </MotiView>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
