import { DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#2F2F2F",
    primary: "#4C4C9D",
    secondary: "#1F2732",
    error: "#ED1C24",
  },

  back: {
    marginTop: 10,
    marginRight: 10,
    alignSelf: "flex-end",
  },
  
};

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

