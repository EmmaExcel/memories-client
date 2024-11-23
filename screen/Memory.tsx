import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { Feather } from "@expo/vector-icons";
import { API_URL } from "../api";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUserContext } from "../context/userContext";

const { width } = Dimensions.get("window");

type AuthStackParamList = {
  memory: undefined;
  memorydetails: { memory: any };
  addmemory: { memory: any };
  editmemory: { memory: any };
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function Memory() {
  const [isLoading, setIsLoading] = useState(true);
  const [memory, setMemory] = useState<any[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const [showToolkit, setShowToolkit] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const { user } = useUserContext();

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

  const handleNavigation = (item: any) => {
    navigation.navigate("memorydetails", { memory: item });
  };
  const handleLongPress = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Provide haptic feedback for a better user experience
    setSelectedMemory(item);
    setShowToolkit(true);
  };

  const handleEdit = (item: any) => {
    setShowToolkit(false);
    navigation.navigate("editmemory", { memory: item });
  };

  const handleDelete = async (id: string) => {
    setShowToolkit(false);
    try {
      await axios.delete(`${API_URL}/memory/${id}`);
      // Immediately update local state
      setMemory((prevMemories) =>
        prevMemories.filter((item) => item._id !== id)
      );
      setSelectedMemory(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const ToolkitModal = () =>
    showToolkit ? (
      <Modal
        transparent
        visible={showToolkit}
        animationType="fade"
        onRequestClose={() => {
          setShowToolkit(false);
          setSelectedMemory(null); // Reset state
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={() => {
            setShowToolkit(false);
            setSelectedMemory(null);
          }}
        >
          <MotiView
            from={{ translateY: 100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            className="absolute bottom-0 w-full bg-[#252525] rounded-t-3xl overflow-hidden"
          >
            <View className="p-4">
              <View className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />

              {/* Edit Button */}
              {selectedMemory?.userId && selectedMemory.userId === user._id && (
                <TouchableOpacity
                  className="flex-row items-center p-4 border-b border-gray-700"
                  onPress={() => {
                    handleEdit(selectedMemory);
                    setShowToolkit(false);
                  }}
                >
                  <Feather name="edit-2" size={24} color="white" />
                  <Text className="text-white text-lg ml-3">Edit Memory</Text>
                </TouchableOpacity>
              )}

              {/* Share Button */}
              <TouchableOpacity
                className="flex-row items-center p-4 border-b border-gray-700"
                onPress={() => {
                  setShowToolkit(false);
                }}
              >
                <Feather name="share-2" size={24} color="white" />
                <Text className="text-white text-lg ml-3">Share Memory</Text>
              </TouchableOpacity>

              {/* Delete Button */}
              {selectedMemory?.userId && selectedMemory.userId === user._id && (
                <TouchableOpacity
                  className="flex-row items-center p-4"
                  onPress={() => {
                    handleDelete(selectedMemory._id);
                    setShowToolkit(false);
                  }}
                >
                  <Feather name="trash-2" size={24} color="#ef4444" />
                  <Text className="text-red-500 text-lg ml-3">
                    Delete Memory
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </MotiView>
        </TouchableOpacity>
      </Modal>
    ) : null;

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A1A]">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="px-6 py-4 flex-row items-center justify-between"
      >
        <Text className="text-3xl font-bold text-white">Memories</Text>

        <View className="flex-row gap-x-3 items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate("addmemory" as never)}
            className="bg-white/10  h-12 w-12 items-center justify-center  rounded-full"
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("profile" as never)}
            className="bg-white/10 h-12 w-12 rounded-full overflow-hidden"
          >
            <Image
              source={{
                uri: user.profilePicture,
              }}
              style={{ width: "100%", height: "100%" }}
              className="h-full w-full object-cover"
            />
          </TouchableOpacity>
        </View>
      </MotiView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-2">
          {memory.map((item: any, index: number) => (
            <TouchableOpacity key={item._id}>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 100 }}
                className="mb-6 bg-[#252525] rounded-2xl overflow-hidden"
              >
                {/* Image Carousel */}
                <View className="w-full flex-row flex-wrap items-center justify-start ">
                  {item.images.slice(0, 4).map((image: any, index: any) => {
                    const numberOfImages = item.images.length;

                    // Determine styles based on the number of images
                    let imageStyle = {};
                    if (numberOfImages === 1) {
                      imageStyle = { width: "100%", height: 300 }; // Full width and height
                    } else if (numberOfImages === 2) {
                      imageStyle = { width: "50%", height: 150 }; // Half width
                    } else if (numberOfImages === 3) {
                      if (index < 2) {
                        imageStyle = { width: "50%", height: 150 }; // First two images side-by-side
                      } else {
                        imageStyle = { width: "100%", height: 150 }; // Last image full width
                      }
                    } else {
                      imageStyle = { width: "50%", height: 150 }; // Default for 4 or more
                    }

                    return (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={imageStyle}
                        className="object-cover rounded-lg"
                      />
                    );
                  })}
                </View>

                {/* Content */}
                <TouchableOpacity
                  onPress={() => {
                    handleNavigation(item);
                  }}
                  onLongPress={() => handleLongPress(item)}
                  delayLongPress={500}
                  className="p-4"
                >
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

                    {/* <TouchableOpacity className="flex-row items-center">
                      <Text className="text-neutral-100 mr-1">Read More</Text>
                      <Feather name="chevron-right" size={16} color="#22d3ee" />
                    </TouchableOpacity> */}
                  </View>
                </TouchableOpacity>
              </MotiView>
            </TouchableOpacity>
          ))}
        </View>
        <ToolkitModal />
      </ScrollView>
    </SafeAreaView>
  );
}
