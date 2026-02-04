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
        // 1. Vorhandene Tasks laden (Das hat gefehlt!)
        const jsonValue = await AsyncStorage.getItem("tasks");
        const currentTasks = jsonValue != null ? JSON.parse(jsonValue) : [];

        // 2. Wert umwandeln (Komma zu Punkt für JS)
        const numerischerWert = parseFloat(wert.replace(",", "."));

        // Validierung: Falls jemand nur ein Komma eingibt
        if (isNaN(numerischerWert)) {
          Platform.OS === "web"
            ? window.alert("Bitte eine gültige Zahl eingeben")
            : Alert.alert("Fehler", "Ungültige Zahl");
          return;
        }

        const newTask = {
          id: Date.now(),
          Aufgabe: aufgabe,
          status: "offen",
          wert: numerischerWert,
        };

        // 3. Speichern
        const updatedTasks = [...currentTasks, newTask];
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

        // 4. Benachrichtigung & Navigation
        if (Platform.OS === "web") {
          window.alert(`Gespeichert: Aufgabe "${aufgabe}" wurde erstellt.`);
          router.replace("/");
        } else {
          Alert.alert("Gespeichert", `Aufgabe "${aufgabe}" wurde erstellt.`, [
            { text: "OK", onPress: () => router.replace("/") },
          ]);
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
        placeholder="Belohnung in €"
        value={wert}
        // Erlaubt Zahlen sowie Punkt und Komma
        onChangeText={(text) => setWert(text.replace(/[^0-9,.]/g, ""))}
        keyboardType="decimal-pad"
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
