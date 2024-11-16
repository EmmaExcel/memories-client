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
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function AddMemory() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  return (
    <SafeAreaView className="flex-1  bg-[#121212]">
      <StatusBar style="light" />
      <ScrollView className="flex-1 ">
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 1000 }}
          className="px-5"
        >
          <Text className="text-4xl font-bold text-white mt-8 mb-2">
            Create
          </Text>
          <Text className="text-4xl font-bold text-white mb-8">New Memory</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", delay: 300 }}
          className="space-y-6 px-5 gap-y-7"
        >
          {/* Image Upload Section */}
          <TouchableOpacity>
            <LinearGradient
              colors={["#2A2A2A", "#1A1A1A"]}
              className="h-48 rounded-2xl items-center justify-center border border-gray-800"
            >
              <Text className="text-white text-lg mb-2">Add Images</Text>
              <Text className="text-gray-500 text-sm">
                Upload up to 4 images
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Image Preview */}
          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-x-3"
            >
              {images.map((image, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", delay: index * 100 }}
                >
                  <Image
                    source={{ uri: image }}
                    style={{ width: width * 0.3, height: width * 0.3 }}
                    className="rounded-xl"
                  />
                </MotiView>
              ))}
            </ScrollView>
          )}

          {/* Title Input */}
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", delay: 400 }}
          >
            <TextInput
              value={title}
              onChangeText={setTitle}
              className="w-full bg-[#1A1A1A] text-white px-5 py-4 rounded-xl text-lg"
              placeholderTextColor="#666"
              placeholder="Title your memory"
            />
          </MotiView>

          {/* Author Input */}
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", delay: 500 }}
          >
            <TextInput
              value={author}
              onChangeText={setAuthor}
              className="w-full bg-[#1A1A1A] text-white px-5 py-4 rounded-xl text-lg"
              placeholderTextColor="#666"
              placeholder="Author"
            />
          </MotiView>

          {/* Content Input */}
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", delay: 600 }}
          >
            <TextInput
              value={content}
              onChangeText={setContent}
              className="w-full bg-[#1A1A1A] text-white px-5 py-4 rounded-xl text-lg min-h-[150px]"
              multiline
              textAlignVertical="top"
              placeholderTextColor="#666"
              placeholder="Write your memory..."
            />
          </MotiView>

          {/* Submit Button */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 700 }}
            className="pb-10"
          >
            <TouchableOpacity className="w-full bg-white py-4 rounded-xl items-center">
              <Text className="text-black text-lg font-semibold">
                Create Memory
              </Text>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}
