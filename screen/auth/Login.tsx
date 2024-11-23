import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { Image } from "expo-image";

import { useUserContext } from "../../context/userContext";
// import {
//   GoogleAuthProvider,
//   signInWithCredential,
//   signInWithPopup,
// } from "firebase/auth";
// import { auth } from "../../firebase";

export default function Auth() {
  const { isLogin, setIsLogin }: any = useUserContext();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black">
      <View className="w-11/12 flex-1 mt-16">
        {isLogin ? (
          <LoginSection switchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterSection switchToLogin={() => setIsLogin(true)} />
        )}
      </View>
    </SafeAreaView>
  );
}

const LoginSection = ({ switchToRegister }: any) => {
  const { handleLogin, loginForm, setLoginForm, LoginData, isLoading }: any =
    useUserContext();

  return (
    <View className="gap-y-8">
      <Text className="text-white text-4xl font-medium">Welcome Back</Text>
      {LoginData.map((item: any) => (
        <View className="gap-y-3" key={item.id}>
          <Text className="text-neutral-200 text-lg">{item.label}</Text>
          <TextInput
            className="h-14 w-full rounded-lg px-4 bg-[#67676730] text-neutral-200"
            placeholder={item.placeholder}
            value={item.value}
            onChangeText={(text) =>
              setLoginForm({ ...loginForm, [item.name]: text })
            }
            autoCapitalize="none"
            secureTextEntry={item.name === "password"}
          />
        </View>
      ))}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        className="bg-neutral-100 h-14 mt-20 rounded-lg items-center justify-center"
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text className="text-black text-lg font-medium">Login</Text>
        )}
      </TouchableOpacity>
      <GoogleButton />
      <SwitchAuthMode
        text="Don't have an account?"
        buttonText="Register"
        onPress={switchToRegister}
      />
    </View>
  );
};

const RegisterSection = ({ switchToLogin }: any) => {
  const { data, formData, setFormData, handleSubmit, isLoading }: any =
    useUserContext();

  return (
    <View className="gap-y-8">
      <Text className="text-white text-4xl font-medium">Set up account</Text>
      {data.map((item: any) => (
        <View className="gap-y-3" key={item.id}>
          <Text className="text-neutral-200 text-lg">{item.label}</Text>
          <TextInput
            className="h-14 w-full rounded-lg px-4 bg-[#67676730] text-neutral-200"
            placeholder={item.placeholder}
            value={item.value}
            onChangeText={(text) =>
              setFormData({ ...formData, [item.name]: text })
            }
            autoCapitalize="none"
            secureTextEntry={item.name === "password"}
          />
        </View>
      ))}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
        className="bg-neutral-100 h-14 mt-20 rounded-lg items-center justify-center"
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text className="text-black text-lg font-medium">Register</Text>
        )}
      </TouchableOpacity>
      <GoogleButton />
      <SwitchAuthMode
        text="Already have an account?"
        buttonText="Login"
        onPress={switchToLogin}
      />
    </View>
  );
};

const GoogleButton = () => {
  const { handleGoogleAuth }: any = useUserContext();

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   webClientId:
  //     "511823124998-b4qduvlev1dfque32qc1qfstlcgmqs4q.apps.googleusercontent.com",
  //   iosClientId:
  //     "511823124998-jd0k9a3fpeklu6h3jkd7f6bbq6f53pvu.apps.googleusercontent.com",
  //   androidClientId:
  //     "511823124998-ddfrm6k0sbeilt8g75pv4mhifiavs4q9.apps.googleusercontent.com",
  // });

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { id_token } = response.params;
  //     const credential = GoogleAuthProvider.credential(id_token);
  //     signInWithCredential(auth, credential).then((result) => {
  //       handleGoogleAuth(id_token);
  //     });
  //   }
  // }, [response]);

  return (
    <TouchableOpacity
      // onPress={() => promptAsync()}
      className="flex-row gap-x-4 bg-[#67676730] h-14 mt-3 rounded-lg items-center justify-center"
    >
      <Image
        source={require("../../assets/google.png")}
        contentFit="contain"
        style={{ width: 20, height: 20 }}
      />
      <Text className="text-white text-lg font-medium">
        Continue with Google
      </Text>
    </TouchableOpacity>
  );
};
const SwitchAuthMode = ({ text, buttonText, onPress }: any) => (
  <View className="flex-row items-center justify-center gap-x-1">
    <Text className="text-neutral-200 text-lg">{text}</Text>
    <TouchableOpacity onPress={onPress}>
      <Text className="text-white text-lg font-medium">{buttonText}</Text>
    </TouchableOpacity>
  </View>
);
