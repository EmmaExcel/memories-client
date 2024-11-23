import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserContext } from "../../context/userContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type AuthStackParamList = {
  memory: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const setupProfile = () => {
  const { user, handleUpdateProfile }: any = useUserContext();
  const navigation = useNavigation<NavigationProp>();
  const [bio, setBio] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = (await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })) as any;

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (image) {
        const imageFile = {
          uri: image,
          type: "image/jpeg",
          name: "profile-picture.jpg",
        } as any;
        formData.append("profilePicture", imageFile);
      }
      formData.append("name", name);
      formData.append("bio", bio);

      await handleUpdateProfile(user._id, formData);
      navigation.navigate("memory");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 bg-black px-5 py-8">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-10">
          <Text className="text-white text-2xl font-medium">
            Customize profile
          </Text>
        </View>

        {/* Profile Picture and Username */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={pickImage}>
            <View className="w-32 h-32 rounded-full overflow-hidden">
              {image ? (
                <Image source={{ uri: image }} className="w-full h-full" />
              ) : (
                <Image
                  source={
                    user?.profilePicture
                      ? { uri: user.profilePicture }
                      : require("../../assets/splash-icon.png")
                  }
                  className="w-full h-full"
                />
              )}
            </View>
            <Text className="text-white text-sm text-center mt-2">Edit</Text>
          </TouchableOpacity>
          <View className="w-full">
            <Text className="text-white text-lg mt-4">@username</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              defaultValue={user.name}
              className="h-14 w-full rounded-lg px-4 bg-[#67676730] text-neutral-200 mt-2"
            />
          </View>
        </View>

        {/* Bio Input */}
        <View className="mb-6">
          <Text className="text-neutral-200 text-lg mb-2">Bio (optional)</Text>
          <TextInput
            className="h-44 bg-[#67676730] text-neutral-200 rounded-lg p-4 text-lg"
            placeholder="Moments ,stories told through pixels.."
            placeholderTextColor="#808080"
            multiline
            defaultValue={user.bio}
            value={bio}
            onChangeText={setBio}
          />
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row justify-end mt-16">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-white px-8 py-4 w-full rounded-lg"
          >
            <Text className="text-black font-medium text-center">
              Save Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default setupProfile;
