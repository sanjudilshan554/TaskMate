import React, { useState, useEffect } from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import DeleteButton from "../../components/DeleteButton";
import axios from "axios";
import {
  Alert,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import BackButton from "../../components/BackButton";
import BackLightButton from "../../components/BackLightButton";
import { lightTheme, darkTheme } from "../core/theme";
import LogoLight from "../../components/LogoLight";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId } = route.params; // Get taskId from route parameters
  const [task, setTask] = useState(null); // State to hold task details
  const [loading, setLoading] = useState(true); // State for loading status
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskStatus, setTaskStatus] = useState(0); // Add state to track task status
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme; // Dynamically set the theme
  const [user, setUser] = useState({});

  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
      fetchUserData();
      setTheme();
    }
  }, [taskId]);

  useEffect(() => {
    if (user.id) {
      setTheme();
    }
  });

  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) {
      const userDetails = JSON.parse(userData);
      setUser(userDetails);
    }
  };

  const setTheme = () => { 
    if (user.theme == 1) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false); 
    }
  };

  const fetchTask = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/task/get/${id}`
      );
      setTask(response.data);
      setTaskTitle(response.data.title);
      setTaskDescription(response.data.description);
      setTaskDate(response.data.selected_date_time);
      setTaskStatus(response.data.status); // Set the initial status from the API response
    } catch (error) {
      alert("Error fetching task") 
    } finally {
      setLoading(false); // Loading is complete
    }
  };

  const updateTask = async () => {
    if (!taskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    if (!taskDate) {
      alert("Please select a date and time.");
      return;
    }

    setLoading(true);
    try {
      const formattedDate = new Date(taskDate).toISOString(); // Convert the date to ISO format for the backend

      const response = await axios.put(
        `http://127.0.0.1:8000/api/task/update/${taskId}`,
        {
          title: taskTitle,
          description: taskDescription,
          selected_date_time: formattedDate,
          status: taskStatus, // Include the task status in the update request
        }
      );

      alert("Task updated successfully");
      navigation.navigate("TaskDetailsScreen", { taskId: taskId });
    } catch (error) {
      alert("Error updating task"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
    >
      <Background style={{ backgroundColor: theme.background }}>
        {isDarkMode ? (
          <BackLightButton
            onPress={() =>
              navigation.replace("TaskDetailsScreen", { taskId: taskId })
            }
          />
        ) : (
          <BackButton
            onPress={() =>
              navigation.replace("TaskDetailsScreen", { taskId: taskId })
            }
          />
        )}
        {isDarkMode ? <LogoLight /> : <Logo />}
        <Header
          style={{
            // color: theme.text,
            fontSize: 21,
            color: theme.primary,
            fontWeight: "bold",
            paddingBottom: 20,
          }}
        >
          Edit Task
        </Header>
        {loading ? (
          <Paragraph>Loading...</Paragraph>
        ) : task ? (
          <>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter task title"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter task description"
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter task date"
              value={taskDate}
              onChangeText={setTaskDate}
            />

            {/* Task Status Radio Buttons */}
            {/* Task Status Radio Buttons */}
            <View style={[styles.radioContainer, { paddingBottom: "20px" }]}>
              <Text style={[{ color: theme.text }]}>Status: </Text>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setTaskStatus(0)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    taskStatus === 0 && {
                      ...styles.selectedRadio,
                      backgroundColor: theme.text,
                    },
                  ]}
                />
                <Text style={[{ color: theme.text }]}>Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setTaskStatus(1)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    taskStatus === 1 && {
                      ...styles.selectedRadio,
                      backgroundColor: theme.text,
                    },
                  ]}
                />
                <Text style={[{ color: theme.text }]}>Completed</Text>
              </TouchableOpacity>
            </View>

            <Button mode="contained" onPress={updateTask} loading={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>

            <DeleteButton
              mode="outlined"
              onPress={async () => {
                const userConfirmed = window.confirm(
                  "Are you sure you want to delete this task?"
                );
                if (userConfirmed) {
                  try {
                    await axios.delete(
                      `http://127.0.0.1:8000/api/task/delete/${taskId}`
                    );
                    alert("Task deleted successfully!");
                    navigation.replace("HomeScreen"); // Navigate back to the previous screen
                  } catch (error) { 
                    alert("Failed to delete the task. Please try again.");
                  }
                } else {
                  alert("Task deletion canceled.");
                }
              }}
            >
              Delete Task
            </DeleteButton>
          </>
        ) : (
          <Paragraph>Task not found or unable to fetch task details.</Paragraph>
        )}
      </Background>
    </ScrollView>
  );
}

const styles = {
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 8,
  },
  selectedRadio: {
    backgroundColor: "blue", // This will be overridden by `theme.text` dynamically.
  },
  radioLabel: {
    fontSize: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
};
