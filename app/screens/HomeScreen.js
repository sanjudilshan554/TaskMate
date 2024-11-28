import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import SubHeader from "../../components/SubHeader";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons;
import { lightTheme, darkTheme } from "../core/theme";

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();

  const theme = isDarkMode ? darkTheme : lightTheme; // Dynamically set the theme

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user.id) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/task/all/${user.id}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const userDetails = JSON.parse(userData);
        setUser(userDetails); // This will trigger the second useEffect
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.replace("LoginScreen");
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskItem, { backgroundColor: theme.card }]}
      onPress={() =>
        navigation.navigate("TaskDetailsScreen", { taskId: item.id })
      }
    >
      <Text
        style={[
          styles.taskTitle,
          { color: theme.text },
          item.status === 1 && styles.completedTask,
        ]}
      >
        {item.title}
      </Text>
      <Text
        style={[
          { color: theme.text },
          item.status === 1 && styles.completedSubTask,
        ]}
      >
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
      <Text style={{ color: theme.text }}>
        Status: {item.status === 1 ? "Completed" : "Pending"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
    >
      <Background>
        <View style={styles.headerIcons}>
          {/* Profile Button */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("UserProfileScreen")}
          >
            <Icon name="account-circle" size={30} color={theme.header} />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Icon name="logout" size={30} color={theme.logout} />
          </TouchableOpacity>

          {/* Theme Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={{ color: theme.text }}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={() => setIsDarkMode(!isDarkMode)}
            />
          </View>
        </View>

        <Logo />
        <SubHeader>Hi {user.name}</SubHeader>
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
        <View style={styles.listContainer}>
          {tasks.length === 0 ? (
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              No tasks available
            </Text>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Previous Tasks
              </Text>
              <FlatList
                data={tasks}
                renderItem={renderTaskItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
      </Background>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  listContainer: {
    marginTop: 20,
  },
  taskItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  completedSubTask: {
    textDecorationLine: "line-through",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
});
