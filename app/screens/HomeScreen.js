import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import SubHeader from "../../components/SubHeader";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    fetchTasks();
    fetchUserData();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/task/all");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) {
      const userDetails = JSON.parse(userData);
      setUser(userDetails);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.replace("LoginScreen");
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() =>
        navigation.navigate("TaskDetailsScreen", { taskId: item.id })
      }
    >
      <Text
        style={[
          styles.taskTitle,
          item.status === 1 && styles.completedTask, // Apply strikethrough if completed
        ]}
      >
        {item.title}
      </Text>
      <Text
        style={[
          item.status === 1 && styles.completedSubTask, // Apply strikethrough if completed
        ]}
      >
        Time:{" "}
        {new Date(item.selected_date_time).toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </Text>
      <Text>Status: {item.status === 1 ? "Completed" : "Pending"}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <Background>
        <View style={styles.headerIcons}>
          {/* Profile Button */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("UserProfileScreen")}
          >
            <Icon name="account-circle" size={30} color="#4CAF50" />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Icon name="logout" size={30} color="#F44336" />
          </TouchableOpacity>
        </View>

        <Logo />
        <SubHeader>Hi {user.name}</SubHeader>
        <Header>Welcome to Task Mate</Header>
        <Paragraph>
          Manage your tasks efficiently. Here’s a list of your current tasks.
        </Paragraph>

        {/* Button to add a new task */}
        <Button
          mode="contained"
          onPress={() => navigation.replace("AddTaskScreen")}
        >
          Add Task
        </Button>

        {/* List of tasks */}
        <View style={styles.listContainer}>
          {tasks.length === 0 ? (
            <Text style={styles.sectionTitle}>No tasks available</Text>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Previous Tasks</Text>
              <FlatList
                data={tasks}
                renderItem={renderTaskItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
      </Background>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    marginTop: 20,
  },
  taskItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  completedTask: {
    textDecorationLine: "line-through", // Apply strikethrough for completed tasks
    color: "gray", // Optional: you can change the text color for completed tasks
  },
  completedSubTask: {
    textDecorationLine: "line-through", // Apply strikethrough for completed tasks
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 5,
  },
});
