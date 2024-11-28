import React, { useState, useEffect } from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, View, StyleSheet, ScrollView, TextInput } from "react-native";
import BackButton from "../../components/BackButton";
import DeleteButton from "../../components/DeleteButton";
import axios from "axios";
import { lightTheme, darkTheme } from "../core/theme";
import LogoLight from "../../components/LogoLight";
import BackLightButton from "../../components/BackLightButton";

export default function UserProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [name, setName] = useState(""); // State for username
  const [email, setEmail] = useState(""); // State for email
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme; // Dynamically set the theme

  useEffect(() => {
    fetchUserData();
    setTheme();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const userDetails = JSON.parse(userData);
        setUser(userDetails);
        setName(userDetails.name || "");
        setEmail(userDetails.email || "");
        if (userDetails.theme === 1) {
          setIsDarkMode(true);
        } else {
          setIsDarkMode(false);
        }
      }
    } catch (error) { 
      alert("Failed to load user data.");
    }
  };

  useEffect(() => {
    if (user) {
      setTheme();
    }
  }, [user]); // Re-run only when 'user' changes

  const setTheme = () => {
    if (!user) {
      return; // Exit if user is not yet loaded
    } 
    if (user.theme == 1) {
      setIsDarkMode(true); 
    } else {
      setIsDarkMode(false); 
    }
  };

  const updateUserProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Validation Error", "Name and email are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/user/update/${user.id}`,
        {
          name,
          email,
        }
      );
      Alert.alert("Success", "Profile updated successfully.");
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response.data.data)
      ); // Update local storage
      fetchUserData(); // Refresh local data
    } catch (error) { 
       alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUserAccount = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/user/delete/${user.id}`);
      alert("Your account has been deleted.");
      await AsyncStorage.clear(); // Clear stored data
      navigation.replace("LoginScreen");
    } catch (error) { 
      alert("Failed to delete account.");
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
    >
      {" "}
      <Background>
        {isDarkMode ? (
          <BackLightButton onPress={() => navigation.replace("HomeScreen")} />
        ) : (
          <BackButton onPress={() => navigation.replace("HomeScreen")} />
        )}
        {isDarkMode ? <LogoLight /> : <Logo />}
        <Header
          style={{
            // color: theme.text,
            fontSize: 21,
            color: theme.primary,
            fontWeight: "bold",
            paddingVertical: 12,
          }}
        >
          User Profile
        </Header>

        {user ? (
          <>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Button
              mode="contained"
              onPress={updateUserProfile}
              loading={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>

            {/* <DeleteButton mode="outlined" onPress={deleteUserAccount} style={styles.deleteButton}>
          Delete Account
        </DeleteButton> */}

            <DeleteButton
              mode="outlined"
              onPress={async () => {
                const userConfirmed = window.confirm(
                  "Are you sure you want to delete your account?"
                );
                if (userConfirmed) {
                  deleteUserAccount();
                } else {
                  alert("Task deletion canceled.");
                }
              }}
            >
              Delete Task
            </DeleteButton>
          </>
        ) : (
          <Header>Loading user data...</Header>
        )}
      </Background>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
});
