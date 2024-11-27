import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";

export default function HomeScreen() {
  const navigation = useNavigation(); // Get navigation object using useNavigation hook

  const tasks = [
    { id: "1", title: "Finish React Native App", status: "In Progress" },
    { id: "2", title: "Update Task Manager UI", status: "Completed" },
    { id: "3", title: "Write documentation", status: "Pending" },
  ];

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 15,
        marginVertical: 5,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
      }}
      onPress={() =>
        navigation.navigate("TaskDetailsScreen", { taskId: item.id })
      }
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <Background>
      <Logo />
      <Header>Welcome to Task Mate</Header>
      <Paragraph>
        Manage your tasks efficiently. Here’s a list of your current tasks.
      </Paragraph>

      {/* Button to add a new task */}
      <Button
        title="Add New Task"
        onPress={() => navigation.replace("AddTaskScreen")} // Navigate to the Add Task screen
      />
      <Button
        mode="contained"
        onPress={() => navigation.replace("AddTaskScreen")}
      >
        Add Task
      </Button>

      {/* List of tasks */}
      <Text>previous Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
      />

      {/* Sign out button */}
      <Button
        title="Sign Out"
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }], // Reset to the login screen
          });
        }}
      />
    </Background>
  );
}
