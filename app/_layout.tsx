import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      ></Stack.Screen>
      <Stack.Screen
        name="profile"
        options={{ title: "Profile" }}
      ></Stack.Screen>
      <Stack.Screen
        name="new_task"
        options={{ title: "New Task" }}
      ></Stack.Screen>
    </Stack>
  );
};

export default _layout;
