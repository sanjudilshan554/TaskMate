import React from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";

export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId, taskTitle, taskDescription, taskStatus } = route.params;  // Example params passed when navigating

  return (
    <Background>
      <Logo />
      <Header>Task Details</Header>
      <Paragraph><strong>Task Title:</strong> {taskTitle}</Paragraph>
      <Paragraph><strong>Description:</strong> {taskDescription}</Paragraph>
      <Paragraph><strong>Status:</strong> {taskStatus}</Paragraph>

      <Button
        mode="outlined"
        onPress={() => {
          // Logic to edit the task
          navigation.navigate("EditTaskScreen", { taskId });
        }}
      >
        Edit Task
      </Button>

      <Button
        mode="outlined"
        onPress={() => {
          // Logic to delete the task
          console.log("Task Deleted");
          navigation.goBack();  // Navigate back to the previous screen after deleting the task
        }}
      >
        Delete Task
      </Button>
    </Background>
  );
}
