import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native"; // Wichtig für Updates
import React, { useEffect, useState } from "react"; // useEffect hinzugefügt
import { StyleSheet, Text, View } from "react-native";

const Guthaben = () => {
  const [tasks, setTasks] = useState([]);
  const isFocused = useIsFocused(); // Erkennt, wenn man auf den Screen navigiert

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

  // Lädt die Daten jedes Mal, wenn der Screen aktiv wird
  useEffect(() => {
    if (isFocused) {
      loadTasks();
    }
  }, [isFocused]);

  // Berechnet die Summe aller erledigten Aufgaben
  const gesamtGuthaben = tasks
    .filter((t) => t.status === "erledigt")
    .reduce((sum, current) => sum + current.wert, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.HadlineText}>Guthaben</Text>
      </View>
      <Text style={styles.label}>Dein aktuelles Guthaben:</Text>
      <Text style={styles.amount}>{gesamtGuthaben} €</Text>
    </View>
  );
};

export default Guthaben;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
  label: {
    fontSize: 18,
    color: "#555",
  },
  amount: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2e7d32", // Ein schönes Geld-Grün
  },
});
