import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../api";

const { width } = Dimensions.get("window");

interface ImageItem {
  uri: string;
  isLocal: boolean;
}

export default function AddMemory() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    navigation.navigate("memory");
  };

  const handleSave = async () => {
    try {
      if (!title || !author || !content) {
        alert("Please fill in all fields");
        return;
      }

      const newMemory = {
        title,
        author,
        content,
        images: images.map((img) => img.uri),
      };

      const response = await axios.post(API_URL + "/memory", newMemory);
      console.log(response.data);
      navigation.navigate("memory");
    } catch (error) {
      console.log(error);
      alert("An error occurred, please try again.");
    }
  };

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
                  className="w-20 h-20 bg-gray-800 rounded-lg items-center justify-center"
                  onPress={pickImage}
                >
                  <Feather name="plus" size={24} color="#666" />
                </TouchableOpacity>

                {images.map((image, index) => (
                  <MotiView
                    key={index}
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", delay: index * 100 }}
                  >
                    <Image
                      source={{ uri: image.uri }}
                      style={{ width: 80, height: 80 }}
                      className="rounded-lg"
                      contentFit="cover"
                    />
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
