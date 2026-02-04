import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@react-navigation/elements";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const index = () => {
  const [tasks, setTasks] = useState([]);

  // Funktion zum Laden der Daten
  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("tasks");
      if (jsonValue !== null) {
        setTasks(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Fehler beim Laden:", e);
    }
  };

  // Lädt Daten neu, sobald der Screen "fokussiert" wird (auch beim Zurückkehren)
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, []),
  );

  const SubmitFinish = async (id) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, status: "erledigt" } : t,
    );
    setTasks(updatedTasks);
    // Auch den neuen Status im Speicher sichern!
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const renderOpenItem = ({ item }) => {
    if (item.status !== "offen") return null;
    return (
      <View style={styles.TaskItem}>
        <Text> Aufgabe: {item.Aufgabe} </Text>
        <Text> Belohnung: {item.wert}€ </Text>
        <Button onPress={() => SubmitFinish(item.id)}>Erledigt</Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.HadlineText}>Home</Text>
      </View>
      <Text style={styles.title}> Aufgabe: </Text>

      <FlatList
        data={tasks}
        renderItem={renderOpenItem}
        keyExtractor={(item, index) => index.toString()}
      ></FlatList>

      <Link href="./new_task" asChild>
        <TouchableOpacity style={styles.floatingButton}>
          {}
          <Ionicons name="add" size={48} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default index;

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

  title: {
    marginTop: 150,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  TaskItem: {
    marginBottom: 20,
    padding: 20,
    borderBottomColor: "#00000084",
    borderBottomWidth: 2,
  },
  floatingButton: {
    backgroundColor: "#8bd3f0",
    alignSelf: "flex-end",
    padding: 5,
    borderRadius: 45,
    width: 60,
    height: 60,
  },
});
