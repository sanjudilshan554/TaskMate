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
import axios from "axios";

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tasks");
      setTasks(response.data);
      console.log("response", response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const navigation = useNavigation();

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() =>
        navigation.navigate("TaskDetailsScreen", { taskId: item.id })
      }
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text>Title: {item.status}</Text>
      <Text>
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
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <Background>
        <Logo />
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
        <Text style={styles.sectionTitle}>Previous Tasks</Text>
        <View style={styles.listContainer}>
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Sign out button */}
        <Button
          title="Sign Out"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          }}
        />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
