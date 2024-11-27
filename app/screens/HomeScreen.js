import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import Background from "../../components/Background";  // Assuming Background component adds some styling
import Logo from "../../components/Logo";  // Assuming Logo component displays a logo
import Header from "../../components/Header";  // Assuming Header displays a title
import Paragraph from "../../components/Paragraph";  // Assuming Paragraph is a styled text component

export default function HomeScreen({ navigation }) {

  // Sample data for tasks (Replace with actual data from your state or API)
  const tasks = [
    { id: '1', title: 'Finish React Native App', status: 'In Progress' },
    { id: '2', title: 'Update Task Manager UI', status: 'Completed' },
    { id: '3', title: 'Write documentation', status: 'Pending' },
  ];

  // Render each task in the list
  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
      }}
      onPress={() => navigation.navigate('TaskDetailsScreen', { taskId: item.id })}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <Background>
      <Logo />
      <Header>Welcome to Task Manager 💼</Header>
      <Paragraph>Manage your tasks efficiently. Here’s a list of your current tasks.</Paragraph>

      {/* Button to add a new task */}
      <Button
        title="Add New Task"
        onPress={() => navigation.navigate('AddTaskScreen')} // Navigates to the Add Task screen
      />

      {/* List of tasks */}
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
            routes: [{ name: "LoginScreen" }],  // Reset to the login screen
          });
        }}
      />
    </Background>
  );
}
