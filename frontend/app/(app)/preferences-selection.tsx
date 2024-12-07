import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Chip, Text} from "react-native-paper";
import {addPreferencesForUser, getAllPreferences} from "@/api";
import {useAuth} from "@/security/AuthProvider";
import {useRouter} from "expo-router";

export default function PreferencesSelection() {
  const auth = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await getAllPreferences();
        setPreferences(response);
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, []);

  const togglePreference = (preference: string) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((item) => item !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await addPreferencesForUser(
        {listOfPreferences: selectedPreferences},
        {userId: auth.user?.id ?? 0}
      );
      router.navigate("/");
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Select Your Preferences
      </Text>
      <View style={styles.chipContainer}>
        {preferences.map((preference) => (
          <Chip
            key={preference}
            style={styles.chip}
            onPress={() => togglePreference(preference)}
            selected={selectedPreferences.includes(preference)}
            selectedColor={"#298a47"}
          >
            {preference}
          </Chip>
        ))}
      </View>
      <Button
        mode="contained"
        onPress={handleSavePreferences}
        loading={loading}
        disabled={loading}
        style={styles.saveButton}
      >
        Save Preferences
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    display: "flex",
    paddingVertical: 80,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  chip: {
    margin: 4,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    marginTop: 16,
  },
});
