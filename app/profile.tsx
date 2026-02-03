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

  // 2. Summe berechnen: Nur von erledigten Aufgaben
  const gesamtGuthaben = tasks
    .filter((t) => t.status === "erledigt")
    .reduce((sum, current) => sum + current.wert, 0);

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
      <Text style={styles.title}>Mein Profil</Text>
      <Text style={styles.balance}>Gesamt verdient: {gesamtGuthaben}€</Text>

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
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  balance: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
});
