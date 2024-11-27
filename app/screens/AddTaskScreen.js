import React, { useState } from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";  // Assume you have a TextInput component

export default function AddTaskScreen({ navigation }) {
  const [taskTitle, setTaskTitle] = useState("");

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      // Add the task (logic to save task)
      console.log("New Task Added:", taskTitle);
      navigation.goBack();  // Navigate back to the previous screen after adding the task
    } else {
      alert("Please enter a task title");
    }
  };

  return (
    <Background>
      <Logo />
      <Header>Add a New Task</Header>
      <Paragraph>Enter the task details below:</Paragraph>
      <TextInput
        label="Task Title"
        value={taskTitle}
        onChangeText={setTaskTitle}
        placeholder="Enter task title"
      />
      <Button mode="contained" onPress={handleAddTask}>
        Add Task
      </Button>
    </Background>
  );
}
