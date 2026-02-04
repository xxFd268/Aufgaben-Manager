import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router"; // 1. Import hinzufügen
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
  const [aufgabe, setAufgabe] = useState("");
  const [wert, setWert] = useState("");
  const router = useRouter(); // 2. Router initialisieren

  const saveTask = async () => {
    if (aufgabe && wert) {
      try {
        const jsonValue = await AsyncStorage.getItem("tasks");
        const currentTasks = jsonValue != null ? JSON.parse(jsonValue) : [];

        const newTask = {
          id: Date.now(),
          Aufgabe: aufgabe,
          status: "offen",
          wert: parseInt(wert),
        };

        const updatedTasks = [...currentTasks, newTask];
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

        // 3. Erst benachrichtigen, dann navigieren
        if (Platform.OS === "web") {
          window.alert(`Gespeichert: Aufgabe "${aufgabe}" wurde erstellt.`);
          router.replace("/"); // Zurück zur Index-Seite
        } else {
          Alert.alert(
            "Gespeichert",
            `Aufgabe "${aufgabe}" wurde erstellt.`,
            [{ text: "OK", onPress: () => router.replace("/") }], // Navigation nach Klick auf OK
          );
        }

        setAufgabe("");
        setWert("");
      } catch (e) {
        console.error("Fehler beim Speichern", e);
      }
    } else {
      if (Platform.OS === "web") window.alert("Bitte alle Felder ausfüllen");
    }
  };

  return (
    <View style={styles.container}>
      {/* ... Dein restliches JSX bleibt gleich ... */}
      <Text style={styles.title}>Neue Aufgabe erstellen:</Text>
      <Text>Aufgabe:</Text>
      <TextInput
        style={styles.input}
        placeholder="Deine Aufgabe"
        value={aufgabe}
        onChangeText={setAufgabe}
      />
      <Text>Wert:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setWert(text.replace(/[^0-9]/g, ""))}
        value={wert}
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
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
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
