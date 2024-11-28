import React from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

import { theme } from "../app/core/theme";

export default function Background({ children, theme }) {
  console.log("theme", theme);
  return (
    <ImageBackground
      source={require("../assets/items/dot.png")}
      resizeMode="repeat"
      style={styles.theme}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// theme.js
export const lightTheme = {
  background: "#fff",
  text: "#000",
  card: "#f2f2f2",
  header: "#4CAF50",
  logout: "#F44336",
};

export const darkTheme = {
  background: "#000",
  text: "#fff",
  card: "#333",
  header: "#81C784",
  logout: "#E57373",
};

const styles = StyleSheet.create({
  light_background: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface,
  },
  dark_background: {
    flex: 1,
    width: "100%",
    text: "#fff",
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
