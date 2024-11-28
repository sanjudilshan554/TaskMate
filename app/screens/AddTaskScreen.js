import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button as RNButton,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../core/theme";
import LogoLight from "../../components/LogoLight";
import BackLightButton from "../../components/BackLightButton";

export default function AddTaskScreen({ navigation }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [text, setText] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [last_saved_task, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme; // Dynamically set the theme

  // State for task status
  const [taskStatus, setTaskStatus] = useState(0); // Default status is "Pending"
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUserData();
    setTheme();
  }, []);

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

  const addTask = async () => {
    if (!taskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    if (!date) {
      alert("Please select a date and time.");
      return;
    }

    setLoading(true);
    try {
      const formattedDate = date.toISOString();

      const response = await axios.post(
        `http://127.0.0.1:8000/api/task/store/${user.id}`,
        {
          title: taskTitle,
          description: text,
          reminder_time: formattedDate,
          status: taskStatus, // Include task status in the request
        }
      );

      setTaskTitle("");
      setText("");
      setTaskStatus("Pending"); // Reset status to default
      setDate(new Date());
      alert("Task added successfully");
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev);
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
    >
      <Background style={{ backgroundColor: theme.background }}>
        <BackButton onPress={() => navigation.replace("HomeScreen")} />
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
          Add a New Task
        </Header>
        <Paragraph
          style={{
            color: theme.text,
            fontSize: 15,
            lineHeight: 21,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Enter the task details below:
        </Paragraph>
        <View style={styles.container}>
          {/* Task Title Input */}
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Enter task title"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />

          {/* Task Description */}
          <TextInput
            style={[styles.textArea, { color: theme.text }]}
            placeholder="Type your task description here..."
            value={text}
            onChangeText={setText}
            multiline={true}
          />

          {/* Task Status Radio Buttons */}
          <View style={styles.radioContainer}>
            <Text
              style={{
                color: theme.text,
              }}
            >
              Status:
            </Text>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setTaskStatus(0)}
            >
              <View
                style={[
                  styles.radioCircle,
                  taskStatus === 0 && { backgroundColor: theme.text }, // Use theme.text
                ]}
              />
              <Text
                style={{
                  color: theme.text,
                  fontSize: 16,
                }}
              >
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setTaskStatus(1)}
            >
              <View
                style={[
                  styles.radioCircle,
                  taskStatus === 1 && { backgroundColor: theme.text }, // Use theme.text
                ]}
              />
              <Text
                style={{
                  color: theme.text,
                  fontSize: 16,
                }}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selected Date Display */}
          {date && (
            <Text
              style={{
                color: theme.text,
              }}
            >
              <Text
                style={{
                  color: theme.text,
                }}
              >
                Reminder on:{" "}
              </Text>
              {new Date(date).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}

          {/* DateTime Picker */}
          <View style={styles.dateButton}>
            <RNButton
              title={showDatePicker ? "Hide Date Picker" : "Show Date Picker"}
              onPress={toggleDatePicker}
            />
          </View>

          {showDatePicker && (
            <DateTimePicker
              onChange={(newDate) => setDate(newDate)}
              value={date}
            />
          )}

          <Button mode="contained" onPress={addTask} loading={loading}>
            {loading ? "Adding..." : "Add Task"}
          </Button>
        </View>
      </Background>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: "15px",
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

  selectedDate: {
    fontSize: 16,
    marginBottom: 20,
  },
  dateButton: {
    marginBottom: 20,
  },
});
