import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserContext } from "../../context/userContext";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { useMemory } from "../../context/memoryContext";
import { API } from "../../api";

export default function profile() {
  const { user, navigate, handleLogout }: any = useUserContext();
  const [allMemories, setAllMemories] = useState([]);
  const [userMemories, setUserMemories] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (image: string) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const getAllMemories = async () => {
    try {
      const response = await API.get(`/memory`);
      setAllMemories(response.data.data);
      console.log("Fetch success:", response.data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllMemories(); // Fetch all memories
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter memories by current user's ID
    if (allMemories.length && user?._id) {
      const filteredMemories = allMemories.filter(
        (memory: any) => memory.userId === user._id
      );
      setUserMemories(filteredMemories);
    }
  }, [allMemories, user]);

  const { width, height } = Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1 items-center bg-black">
      <View className="w-11/12  flex-1">
        <View className="flex-row justify-between items-center mt-3">
          <TouchableOpacity
            className="flex-row gap-x-2 items-center "
            onPress={() => navigate.navigate("memory")}
          >
            <FontAwesome name="chevron-left" size={14} color="white" />
            <Text className="text-white  text-lg">{"Profile"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text className="text-red-500 font-medium ">logout</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-y-5">
          <View className="flex items-center gap-y-3">
            <Image
              source={{
                uri: user.profilePicture || "https://i.pravatar.cc/150",
                resizeMode: "cover",
              }}
              className="h-24 w-24 rounded-full"
              style={{
                borderRadius: 100,
                width: 150,
                height: 150,
                backgroundColor: "gray",
              }}
            />

            <Text className="text-neutral-200 text-lg ">@{user.name}</Text>
            <Text className="text-neutral-400 w-10/12 line-clamp-6 text-sm text-center">
              {user.bio}
            </Text>
          </View>

          <View className="items-center">
            <TouchableOpacity onPress={() => navigate.navigate("setupprofile")}>
              <Text className="text-center px-2 py-2 rounded-lg capitalize text-neutral-200 bg-neutral-800 font-medium">
                update profile
              </Text>
            </TouchableOpacity>
          </View>

          <View className="h-full border-t w-full  border-neutral-700">
            <ScrollView className="pt-3 w-full max-h-[450px]  ">
              <View className="flex-wrap flex-row gap-0.5">
                {userMemories
                  .flatMap((memory: any) => memory.images) // Flatten all images into a single array
                  .map((image: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => openImage(image)}
                    >
                      <Image
                        style={{ width: 118, height: 110 }}
                        source={{ uri: image }}
                        className="rounded-md"
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <Modal
          visible={!!selectedImage}
          transparent={true}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.9)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Full-Screen Image */}
            <Image
              source={{ uri: selectedImage || "" }}
              style={{
                width: width * 0.9,
                height: height * 0.7,
                resizeMode: "contain",
              }}
            />

            {/* Close Button */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 40,
                right: 20,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 20,
                padding: 10,
              }}
              onPress={closeImage}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/ios-filled/50/ffffff/macos-close.png",
                }}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
