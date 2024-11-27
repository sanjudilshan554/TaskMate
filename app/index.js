import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";  // Import this component
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./core/theme";
import { StartScreen, LoginScreen, RegisterScreen, ResetPasswordScreen, HomeScreen, EditTaskScreen, TaskDetailsScreen, AddTaskScreen } from "./screens"; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      {/* <NavigationContainer>   */}
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          <Stack.Screen name="TaskDetailsScreen" component={TaskDetailsScreen} />
          <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
          <Stack.Screen name="EditTaskScreen" component={EditTaskScreen} />
        </Stack.Navigator>
      {/* </NavigationContainer> */}
    </Provider>
  );
}
