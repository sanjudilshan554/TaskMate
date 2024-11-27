import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button as RNButton,
} from "react-native";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";

export default function AddTaskScreen({ navigation }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [text, setText] = useState("");
  const [reminderTime, setReminderTime] = useState(""); // New state for reminder time
  const [last_saved_task, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // New state to toggle date picker visibility

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/last-saved-task"
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching last_saved_task:", error);
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
      const formattedDate = date.toISOString(); // Convert the date to ISO format for the backend

      const response = await axios.post("http://127.0.0.1:8000/api/tasks", {
        title: taskTitle,
        description: text,
        reminder_time: formattedDate, // Use the combined date and time from the picker
      });

      setTaskTitle("");
      setText("");
      setDate(new Date()); // Reset the date picker
      alert("Task added successfully");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle DateTimePicker visibility
  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev);
  };

  return (
    <Background>
      <Logo />
      <Header>Add a New Task</Header>
      <Paragraph>Enter the task details below:</Paragraph>

      <View style={styles.back} > <Button onPress={() => navigation.replace("HomeScreen")}> {"<-"} Back </Button></View>

      <View style={styles.container}>
        <View style={styles.latest_card}>
          <Paragraph>Latest Saved Task:</Paragraph>
          {last_saved_task && (
            <View style={styles.taskContainer}>
              <Text style={styles.task}>
                <Text style={styles.header}>Title: </Text>{" "}
                {last_saved_task.title}
              </Text>
              <Text style={styles.task}>
                <Text style={styles.header}>Time: </Text>
                {new Date(last_saved_task.selected_date_time).toLocaleString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }
                )}
              </Text>
              <Text style={styles.task}>
                <Text style={styles.header}>Description: </Text>{" "}
                {last_saved_task.description}
              </Text>
            </View>
          )}
        </View>

        {/* Task Title Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        {/* Task Description Text Area */}
        <TextInput
          style={styles.textArea}
          placeholder="Type your task description here..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          multiline={true}
          numberOfLines={4}
        />

        {/* Display the selected date */}
        {date && (
          <Text style={styles.selectedDate}>
            <Text style={styles.header}>Reminder on: </Text>{" "}
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

        {/* Toggle Button to Show/Hide DateTimePicker */}
        <View style={styles.dateButton}>
          <RNButton
            title={showDatePicker ? "Hide Date Picker" : "Show Date Picker"}
            onPress={toggleDatePicker}
          />
        </View>

        {/* Date Picker Component for Web */}
        {showDatePicker && (
          <DateTimePicker
            onChange={(newDate) => setDate(newDate)} // Update the date state
            value={date} // Bind the current date and time
            format="y-MM-dd h:mm a" // Display date and time in a readable format
          />
        )}

        <Button mode="contained" onPress={addTask} loading={loading}>
          {loading ? "Adding..." : "Add Task"}
        </Button>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  task: {
    fontSize: 15,
    marginVertical: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 100, // Height for the text area
    textAlignVertical: "top", // Align text to the top
    marginBottom: 20,
  },
  datePicker: {
    width: "100%", // Ensure it spans full width
    marginVertical: 10, // Add margin to separate from other elements
    borderColor: "#ccc", // Optional: Style the border
    borderWidth: 1,
    borderRadius: 5, // Optional: round the corners
  },
  taskContainer: {
    paddingBottom: "40px",
  },

  header: {
    fontWeight: "bold",
  },

  latest_card: {
    border: "1px 1px solid black",
    backgroundColor: "rgb(252, 255, 255)",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "1px 1px 10px rgb(190, 190, 203)",
    padding: "10px",
    alignItem: "center",
    justifyContent: "center",
  }, 

  back: {
    marginTop: 10,
    marginRight: 10, 
    alignSelf: "flex-end",  
  },
});
