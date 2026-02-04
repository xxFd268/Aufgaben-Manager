import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 80, // Setzt die Höhe auf 100px
          paddingBottom: 30, // Schiebt die Icons/Texte etwas hoch, damit sie mittig wirken
          backgroundColor: "white", // Optional: Hintergrundfarbe
        },
        tabBarActiveTintColor: "#8bd3f0", // Farbe für den aktiven Tab
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          headerShown: false,
          title: "Home",
        }}
      />
      {/* ... restliche Screens ... */}
      <Tabs.Screen
        name="guthaben"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
          headerShown: false,
          title: "Guthaben",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="history" size={size} color={color} />
          ),
          headerShown: false,
          title: "History",
        }}
      />
      <Tabs.Screen
        name="new_task"
        options={{
          headerShown: false,
          href: null,
        }}
      />
    </Tabs>
  );
};

export default _layout;
