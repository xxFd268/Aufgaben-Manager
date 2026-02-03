import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@react-navigation/elements";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

const new_task = () => {
  const [aufgabe, setAufgabe] = useState("");
  const [wert, setWert] = useState("");

  const saveTask = async () => {
    if (aufgabe && wert) {
      try {
        // 1. Vorhandene Liste aus dem Speicher holen
        const jsonValue = await AsyncStorage.getItem("tasks");
        const currentTasks = jsonValue != null ? JSON.parse(jsonValue) : [];

        // 2. Das neue Objekt exakt nach deinem Wunsch-Format erstellen
        const newTask = {
          id: Date.now(), // Erzeugt eine eindeutige Nummer
          Aufgabe: aufgabe,
          status: "offen",
          wert: parseInt(wert), // Stellt sicher, dass es eine Zahl ist
        };

        // 3. Den neuen Task an die Liste hängen
        const updatedTasks = [...currentTasks, newTask];

        // 4. Alles als String zurück in den Speicher schreiben
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

        Alert.alert("Gespeichert", `Aufgabe "${aufgabe}" wurde erstellt.`);

        // Felder zurücksetzen
        setAufgabe("");
        setWert("");
      } catch (e) {
        console.error("Fehler beim Speichern", e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Neu Aufgabe erstellen: </Text>

      <Text>Aufgabe:</Text>
      <TextInput
        style={styles.input}
        placeholder="Deine Aufgabe"
        onChangeText={(text) => setAufgabe(text)}
      ></TextInput>

      <Text>Wert:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setWert(text.replace(/[^0-9]/g, ""))}
        placeholder="Belohnung in €"
        keyboardType="numeric"
      />

      <Button onPress={saveTask}>Task Hinzufügen</Button>
    </View>
  );
};

export default new_task;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  input: {
    borderBottomWidth: 2,
    marginBottom: 100,
  },
});
