import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Loading() {
  return (
    <View className="flex-1 justify-center items-center">
      <View style={styles.container}>
        <Text
          style={{
            color: "white",
            fontFamily: "Doto",
            fontSize: 40,
            fontWeight: "600",
          }}
        >
          Memories
        </Text>
        <ActivityIndicator color={"white"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    top: 170,
    backgroundColor: "gray",
    height: 104,
    width: 250,
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
