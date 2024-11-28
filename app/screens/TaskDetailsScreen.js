import React, { useState, useEffect } from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import axios from "axios";
import { View, StyleSheet, ScrollView } from "react-native";
import BackButton from "../../components/BackButton";
import DeleteButton from "../../components/DeleteButton";
import CompleteButton from "../../components/CompleteButton";
import { lightTheme, darkTheme } from "../core/theme";
import LogoLight from "../../components/LogoLight";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackLightButton from "../../components/BackLightButton";

export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId } = route.params; // Get taskId from route parameters
  const [task, setTask] = useState(null); // State to hold task details
  const [loading, setLoading] = useState(true); // State for loading status
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
  }, [user]);

  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) {
      const userDetails = JSON.parse(userData);
      setUser(userDetails);
    }
  };

  const setTheme = () => {
    console.log("user", user);
    if (user.theme == 1) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
      console.log("theme", false);
    }
  };

  const fetchTask = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/task/get/${id}`
      );
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false); // Loading is complete
    }
  };

  const handleCompleteTask = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to complete this task?"
    );
    if (userConfirmed) {
      try {
        await axios.get(`http://127.0.0.1:8000/api/task/complete/${taskId}`);
        alert("Task Completed Successfully");
        setTask((prevTask) => ({ ...prevTask, status: 1 })); // Directly update task status
      } catch (error) {
        console.error("Error completing task:", error);
        alert("Failed to save completed task. Please try again.");
      }
    } else {
      alert("Task completion canceled.");
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
    >
      <Background style={{ backgroundColor: theme.background }}>
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
            paddingBottom: 20,
          }}
        >
          Task Details
        </Header>

        {loading ? (
          <Paragraph>Loading...</Paragraph>
        ) : task ? (
          <>
            <View style={[styles.latest_card, { backgroundColor: theme.card }]}>
              <Paragraph style={{ color: theme.text, padding: "5px" }}>
                <strong>Task Title:</strong> {task.title}
              </Paragraph>
              <Paragraph style={{ color: theme.text, padding: "5px" }}>
                <strong>Description:</strong> {task.description}
              </Paragraph>
              <Paragraph style={{ color: theme.text, padding: "5px" }}>
                <strong>Time:</strong>{" "}
                {new Date(task.selected_date_time).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Paragraph>
              <Paragraph style={{ color: theme.text, padding: "5px" }}>
                <strong>Status:</strong>{" "}
                {task.status === 1 ? "Completed" : "Pending"}
              </Paragraph>
            </View>

            {/* Show Complete Task and Edit Task buttons only if task is not completed */}
            {task.status == 0 && (
              <>
                <CompleteButton mode="outlined" onPress={handleCompleteTask}>
                  Complete Task
                </CompleteButton>

                <Button
                  mode="outlined"
                  onPress={() =>
                    navigation.navigate("EditTaskScreen", { taskId })
                  }
                >
                  Edit Task
                </Button>
              </>
            )}

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
                    console.error("Error deleting task:", error);
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

const styles = StyleSheet.create({
  latest_card: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "rgb(252, 255, 255)",
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: "1px 1px 10px rgb(190, 190, 203)",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
