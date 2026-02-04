import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@react-navigation/elements";
import { useFocusEffect } from "expo-router"; // useFocusEffect ergänzt
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const profile = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("tasks");
      if (jsonValue !== null) setTasks(JSON.parse(jsonValue));
    } catch (e) {
      console.error("Fehler beim Laden:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, []),
  );

  // 1. Funktion zum endgültigen Löschen aus dem Speicher
  const deleteTask = async (id) => {
    const remainingTasks = tasks.filter((t) => t.id !== id);
    setTasks(remainingTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(remainingTasks));
  };

  const renderFinishedItem = ({ item }) => {
    if (item.status !== "erledigt") return null;
    return (
      <View style={styles.TaskItem}>
        <Text> Aufgabe: {item.Aufgabe} </Text>
        <Text> Verdient: {item.wert}€ </Text>
        {/* Button löscht jetzt wirklich */}
        <Button onPress={() => deleteTask(item.id)}>Löschen</Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.HadlineText}>History</Text>
      </View>

      <Text style={styles.subtitle}>Erledigte Aufgaben:</Text>
      <FlatList
        data={tasks}
        renderItem={renderFinishedItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    // FIX: Positioniert den Header ganz oben, ohne das Zentrieren der anderen Elemente zu stören
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,

    paddingTop: 50, // Etwas mehr Platz für die Notch/Statusleiste
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#8bd3f0",

    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  HadlineText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    marginBottom: 30,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 150,
  },
});
