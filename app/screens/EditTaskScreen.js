import React, { useState, useEffect } from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import DeleteButton from "../../components/DeleteButton";
import axios from "axios";
import TextInput from "../../components/TextInput";
import { Alert, View, TouchableOpacity, Text } from "react-native";
import BackButton from "../../components/BackButton";

export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId } = route.params; // Get taskId from route parameters
  const [task, setTask] = useState(null); // State to hold task details
  const [loading, setLoading] = useState(true); // State for loading status
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskStatus, setTaskStatus] = useState(0); // Add state to track task status

  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    }
  }, [taskId]);

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
      console.error("Error fetching task:", error);
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
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <BackButton onPress={() => navigation.replace("HomeScreen")} />

      <Logo />
      <Header>Task Details</Header>
      {loading ? (
        <Paragraph>Loading...</Paragraph>
      ) : task ? (
        <>
          <TextInput
            placeholder="Enter task title"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />
          <TextInput
            placeholder="Enter task description"
            value={taskDescription}
            onChangeText={setTaskDescription}
          />
          <TextInput
            placeholder="Enter task date"
            value={taskDate}
            onChangeText={setTaskDate}
          />

          {/* Task Status Radio Buttons */}
          <View style={styles.radioContainer}>
            <Text style={styles.header}>Status: </Text>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setTaskStatus(0)}
            >
              <View
                style={[
                  styles.radioCircle,
                  taskStatus === 0 && styles.selectedRadio,
                ]}
              />
              <Text style={styles.radioLabel}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setTaskStatus(1)}
            >
              <View
                style={[
                  styles.radioCircle,
                  taskStatus === 1 && styles.selectedRadio,
                ]}
              />
              <Text style={styles.radioLabel}>Completed</Text>
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
  );
}

const styles = {
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
  },
  selectedRadio: {
    backgroundColor: "#000",
  },
  radioLabel: {
    fontSize: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
};
