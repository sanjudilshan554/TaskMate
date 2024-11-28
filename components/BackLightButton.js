import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default function BackButton({ onPress  }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        style={styles.image}
        source={require("../assets/items/back_light.png")}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
});
