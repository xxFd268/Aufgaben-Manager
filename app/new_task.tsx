import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@react-navigation/elements";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const NewTask = () => {
  // Komponenten-Namen sollten Groß geschrieben werden
  const [aufgabe, setAufgabe] = useState("");
  const [wert, setWert] = useState("");

  const saveTask = async () => {
    if (aufgabe && wert) {
      try {
        // 1. Vorhandene Liste holen
        const jsonValue = await AsyncStorage.getItem("tasks");
        const currentTasks = jsonValue != null ? JSON.parse(jsonValue) : [];

        // 2. Neues Objekt erstellen
        const newTask = {
          id: Date.now(),
          Aufgabe: aufgabe,
          status: "offen",
          wert: parseInt(wert),
        };

        // 3. Speichern
        const updatedTasks = [...currentTasks, newTask];
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

        // 4. Benachrichtigung (Web vs. Mobil)
        if (Platform.OS === "web") {
          window.alert(`Gespeichert: Aufgabe "${aufgabe}" wurde erstellt.`);
        } else {
          Alert.alert("Gespeichert", `Aufgabe "${aufgabe}" wurde erstellt.`);
        }

        // Felder zurücksetzen
        setAufgabe("");
        setWert("");
      } catch (e) {
        console.error("Fehler beim Speichern", e);
      }
    } else {
      // Kleiner Bonus: Hinweis wenn Felder leer sind
      if (Platform.OS === "web") window.alert("Bitte alle Felder ausfüllen");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neue Aufgabe erstellen:</Text>

      <Text>Aufgabe:</Text>
      <TextInput
        style={styles.input}
        placeholder="Deine Aufgabe"
        value={aufgabe} // Bindet den State an das Feld
        onChangeText={setAufgabe}
      />

      <Text>Wert:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setWert(text.replace(/[^0-9]/g, ""))}
        value={wert} // Bindet den State an das Feld
        placeholder="Belohnung in €"
        keyboardType="numeric"
      />

      <Button onPress={saveTask}>Task Hinzufügen</Button>
    </View>
  );
};

export default NewTask;

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
  input: {
    borderBottomWidth: 2,
    marginBottom: 40, // Etwas reduziert für bessere Übersicht
    paddingVertical: 5,
  },
});
