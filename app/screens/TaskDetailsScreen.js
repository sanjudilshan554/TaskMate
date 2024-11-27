import React, { useState, useEffect } from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import axios from "axios";
import { View, StyleSheet } from "react-native";
import BackButton from "../../components/BackButton";
import DeleteButton from "../../components/DeleteButton";
import CompleteButton from "../../components/CompleteButton";

export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId } = route.params; // Get taskId from route parameters
  const [task, setTask] = useState(null); // State to hold task details
  const [loading, setLoading] = useState(true); // State for loading status

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
    <Background>
      <BackButton onPress={() => navigation.replace("HomeScreen")} />
      <Logo />
      <Header>Task Details</Header>

      {loading ? (
        <Paragraph>Loading...</Paragraph>
      ) : task ? (
        <>
          <View style={styles.latest_card}>
            <Paragraph>
              <strong>Task Title:</strong> {task.title}
            </Paragraph>
            <Paragraph>
              <strong>Description:</strong> {task.description}
            </Paragraph>
            <Paragraph>
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
            <Paragraph>
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
