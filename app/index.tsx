import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@react-navigation/elements";
import { Link, useFocusEffect } from "expo-router"; // useFocusEffect ergänzt
import React, { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

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
      <Link href="./profile" style={styles.link}>
        <Image
          source={require("../assets/img/Felix.png")}
          style={styles.image}
        />
      </Link>

      <Text style={styles.title}> Aufgabe: </Text>

      <FlatList
        data={tasks}
        renderItem={renderOpenItem}
        keyExtractor={(item, index) => index.toString()}
      ></FlatList>

      <Link href="./new_task" asChild>
        <Button>Neuer Task</Button>
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

  link: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#8bd3f0",

    marginLeft: -20,
    marginRight: -20,
    marginTop: -20,
    marginBottom: 60,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  image: {
    width: 80,
    height: 80,
    backgroundColor: "#383838",
    borderRadius: 45,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginBottom: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
  TaskItem: {
    marginBottom: 20,
    padding: 20,
    borderBottomColor: "#00000084",
    borderBottomWidth: 2,
  },
});
