import React, { useState, useEffect } from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, View, StyleSheet } from "react-native";
import BackButton from "../../components/BackButton";
import DeleteButton from "../../components/DeleteButton";
import axios from "axios";

export default function UserProfileScreen({ navigation }) {
  const [user, setUser] = useState(null); // State for user details
  const [loading, setLoading] = useState(false); // Loading state
  const [name, setName] = useState(""); // State for username
  const [email, setEmail] = useState(""); // State for email

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) {
      const userDetails = JSON.parse(userData);
      setUser(userDetails);
      setName(userDetails.name || "");
      setEmail(userDetails.email || "");
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
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update profile.");
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
      console.error("Error deleting user:", error);
      alert("Failed to delete account.");
    }
  };

  return (
    <Background>
      <BackButton onPress={() => navigation.replace("HomeScreen")} />
      <Logo />
      <Header>User Profile</Header>

      {user ? (
        <>
          <TextInput
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
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
  );
}

const styles = StyleSheet.create({});
