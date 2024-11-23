import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

export default function SpecialPage() {
  const [password, setPassword] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % loveMessages.length
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const heartBeat = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Sound refs
  const typingSound = useRef(null);
  const heartSound = useRef(null);
  const unlockSound = useRef(null);
  const hintSound = useRef(null);
  const messageSound = useRef(null);

  const loveMessages = [
    "I miss you more than words can express... There’s a space in my heart that only you can fill, and lately, it’s felt so empty when you talk to me.",
    "I find myself thinking about you every moment, wishing we could be close by, feel your warmth again. ",
    "You are my safe place, my favorite person..",
    "No matter the distance or time, my love for you will never fade. I’ll always be here..",
    "I miss our little moments, the ones that made everything feel right, and I can’t wait to make more memories with you...",
    "I love you more than words can say, and I’ll do anything to remind you of that every day. 🌹",
  ];

  // Load sounds
  useEffect(() => {
    async function loadSounds() {
      const typing = await Audio.Sound.createAsync(
        require("../assets/sounds/typing.mp3")
      );
      const heart = await Audio.Sound.createAsync(
        require("../assets/sounds/heart.mp3")
      );
      const unlock = await Audio.Sound.createAsync(
        require("../assets/sounds/unlock.mp3")
      );
      const hint = await Audio.Sound.createAsync(
        require("../assets/sounds/hint.mp3")
      );
      const message = await Audio.Sound.createAsync(
        require("../assets/sounds/message.mp3")
      );

      typingSound.current = typing;
      heartSound.current = heart;
      unlockSound.current = unlock;
      hintSound.current = hint;
      messageSound.current = message;

      messageSound.current = message;
      await messageSound.current.sound.setIsLoopingAsync(true);
    }
    loadSounds();

    return () => {
      // Cleanup sounds
      [typingSound, heartSound, unlockSound, hintSound, messageSound].forEach(
        async (sound) => {
          if (sound.current) await sound.current.unloadAsync();
        }
      );
    };
  }, []);

  useEffect(() => {
    const soundFinishedListener =
      messageSound.current?.sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await messageSound.current.sound.playAsync(); // Replay the sound if it finishes
        }
      });

    return () => {
      if (soundFinishedListener) {
        soundFinishedListener.remove();
      }
    };
  }, []);

  // Play typing sound
  const playTypingSound = async () => {
    try {
      await typingSound.current.sound.replayAsync();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  // Initial animations
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Heartbeat animation
  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(heartBeat, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heartBeat, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse, { iterations: -1 }).start();
  }, []);

  // Rotate animation for interactive elements
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const checkPassword = async () => {
    if (password.toLowerCase() === "daddy") {
      await unlockSound.current.sound.replayAsync();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setUnlocked(true);
      setShowHearts(true);

      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleHintPress = async () => {
    ``;
    await hintSound.current.sound.replayAsync();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowHint(!showHint);
    Animated.timing(rotateAnim, {
      toValue: showHint ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const nextMessage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentMessageIndex((prev) => (prev + 1) % loveMessages.length);
    } catch (error) {
      console.log("Error playing message sound:", error);
    }
  };
  const playSong = async () => {
    try {
      await messageSound.current.sound.playAsync();
    } catch (error) {
      console.log("Error playing song:", error);
    }
  };
  if (unlocked) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <Animated.View
          ref={playSong}
          className="flex-1 justify-center items-center px-6 relative"
          style={{ transform: [{ translateY: slideAnim }] }}
        >
          <TouchableOpacity onPress={nextMessage} className="w-full">
            <LottieView
              source={require("../assets/heart-animation.json")}
              autoPlay
              loop
              style={{ width: 200, height: 200, alignSelf: "center" }}
            />
          </TouchableOpacity>

          <Animated.Text className="text-neutral-500 text-4xl font-bold text-center mb-8">
            Frog
          </Animated.Text>

          <TouchableOpacity onPress={nextMessage} className="w-full">
            <Animated.Text
              className="text-white text-xl text-center leading-8 mb-8"
              style={{ transform: [{ scale: scaleAnim }] }}
            >
              {loveMessages[currentMessageIndex]}
            </Animated.Text>
          </TouchableOpacity>

          {showHearts && (
            <View className="absolute -top-96 left-0 w-full h-full">
              <LottieView
                source={require("../assets/floating-heart.json")}
                autoPlay
                loop
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          )}

          <View className="absolute bottom-10">
            <TouchableOpacity
              onPress={() => setShowHearts(!showHearts)}
              className="bg-neutral-50/20 px-6 py-3 rounded-full"
            >
              <Text className="text-neutral-500">
                {showHearts ? "Hide Hearts ❤️" : "Show Hearts 💖"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 justify-center items-center px-6">
        <Animated.View
          className="items-center"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <TouchableOpacity onPress={handleHintPress}>
            <LottieView
              source={require("../assets/lock-animation.json")}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
          </TouchableOpacity>

          <Text className="text-white text-3xl font-bold text-center mb-8">
            What is the password to this special place?
          </Text>

          <BlurView
            intensity={30}
            className="w-full max-w-xs overflow-hidden rounded-2xl"
          >
            <TextInput
              className="bg-white/10 text-white text-xl px-6 py-4 rounded-2xl"
              placeholder="Enter password..."
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                playTypingSound();
              }}
              onSubmitEditing={checkPassword}
            />
          </BlurView>

          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <TouchableOpacity onPress={handleHintPress} className="mt-6">
              <Text className="text-white font-semibold text-xl">
                {showHint ? "Call my name " : "Want a hint? 💭"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <LottieView
            source={require("../assets/sparkles.json")}
            autoPlay
            loop
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
