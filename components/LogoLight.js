import React from "react";
import { Image, StyleSheet } from "react-native";

export default function LogoLight() {
  return (
    <Image
      source={require("../assets/icon_light.png")}
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
});
