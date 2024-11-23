import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API, API_URL } from "../api";
import { useMemory } from "../context/memoryContext";

const { width } = Dimensions.get("window");

interface ImageItem {
  uri: string;
  isLocal: boolean;
}

export default function EditMemory() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { handleFetch } = useMemory();

  const route = useRoute<{
    key: string;
    name: string;
    params: {
      memory: {
        _id: string;
        title: string;
        content: string;
        images: string[];
        date: string;
        author: string;
      };
    };
  }>();
  const memory = route.params.memory;

  useEffect(() => {
    // Populate existing memory data
    setTitle(memory.title);
    setAuthor(memory.author);
    setContent(memory.content);
    setImages(
      memory.images.map((imageUrl) => ({
        uri: `${API_URL}/uploads/${imageUrl}`, // Assuming the images are served from a folder named "uploads"
        isLocal: false,
      }))
    );
  }, [memory]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => ({
        uri: asset.uri,
        isLocal: true,
      }));
      setImages([...images, ...selectedImages]);
    }
  };

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("content", content);

      // Upload new images only
      images.forEach((image, index) => {
        if (image.isLocal) {
          const imageUri = image.uri;
          const filename = imageUri.split("/").pop();

          const file = {
            uri: imageUri,
            type: "image/jpeg",
            name: filename || `image-${index}.jpg`,
          };

          formData.append("images", file as any);
        }
      });

      // Include existing images (by their file name) in the payload
      const existingImageNames = memory.images.filter(
        (imageUrl) =>
          !images.some((img) => img.isLocal && img.uri.includes(imageUrl))
      );
      formData.append("existingImages", JSON.stringify(existingImageNames));

      await API.put(`/memory/${memory._id}`, formData);

      setIsLoading(false);

      navigation.navigate("memory" as never);
    } catch (error: any) {
      console.log("Error details:", error.response?.data || error.message);
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (uri: string) => {
    setImages(images.filter((image) => image.uri !== uri));
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#1A1A1A]">
        <StatusBar style="light" />
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A1A]">
      <StatusBar style="light" />

      <View className="flex-1">
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800"
        >
          <TouchableOpacity onPress={handleBack}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="bg-white/10 px-4 py-2 rounded-full"
          >
            <Text className="text-white">Save</Text>
          </TouchableOpacity>
        </MotiView>

        <ScrollView className="flex-1">
          <View className="p-6">
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 300 }}
            >
              <Text className="text-gray-500 text-sm mb-4">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </MotiView>

            <TextInput
              value={title}
              onChangeText={setTitle}
              className="text-3xl font-bold text-white mb-4"
              placeholder="Title"
              placeholderTextColor="#666"
              multiline
            />

            <View className="flex-row items-center mb-6">
              <Feather name="user" size={16} color="#666" />
              <TextInput
                value={author}
                onChangeText={setAuthor}
                className="text-gray-400 ml-2"
                placeholder="Author"
                placeholderTextColor="#666"
              />
            </View>

            <View className="mb-6">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="gap-x-3"
              >
                <TouchableOpacity
                  className="w-20 h-20 bg-gray-800  rounded-lg items-center justify-center"
                  onPress={pickImage}
                >
                  <Feather name="plus" size={24} color="#666" className="" />
                </TouchableOpacity>

                {images.map((image, index) => (
                  <MotiView
                    key={index}
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", delay: index * 100 }}
                  >
                    <View>
                      <Image
                        source={{ uri: image }}
                        style={{ width: 80, height: 80 }}
                        className="rounded-lg"
                        contentFit="cover"
                      />
                      <TouchableOpacity
                        className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
                        onPress={() => handleDeleteImage(image.uri)}
                      >
                        <Feather name="x" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </MotiView>
                ))}
              </ScrollView>
            </View>

            <TextInput
              value={content}
              onChangeText={setContent}
              className="text-white text-lg leading-relaxed"
              multiline
              placeholder="Start writing your memory..."
              placeholderTextColor="#666"
              textAlignVertical="top"
              style={{ minHeight: 300 }}
            />
          </View>
        </ScrollView>

        <MotiView
          from={{ translateY: 50 }}
          animate={{ translateY: 0 }}
          className="flex-row items-center justify-around py-4 px-6 border-t border-gray-800"
        >
          <TouchableOpacity onPress={pickImage}>
            <Feather name="image" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="tag" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="share-2" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="more-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </MotiView>
      </View>
    </SafeAreaView>
  );
}
