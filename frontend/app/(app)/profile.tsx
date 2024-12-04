import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Avatar, Button, Chip, Divider, Text} from "react-native-paper";
import {useAuth} from "@/security/AuthProvider";
import {addPreferencesForUser, getAllPreferences, getPreferencesByUserId} from "@/api";
import Toast from "react-native-toast-message";

// Helper function to get initials
const getInitials = (firstName?: string, lastName?: string) => {
  const firstInitial = firstName?.charAt(0).toUpperCase() || "A";
  const lastInitial = lastName?.charAt(0).toUpperCase() || "A";
  return `${firstInitial}${lastInitial}`;
};

// Helper function to capitalize names
const capitalizeName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function Profile() {
  const auth = useAuth();

  // States for preferences
  const [preferences, setPreferences] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const allPreferences = await getAllPreferences();
        setPreferences(allPreferences);

        const userPreferences = await getPreferencesByUserId({userId: auth.user?.id ?? 0});
        setSelectedPreferences(userPreferences.map((pref) => pref.preferenceType ?? ""));
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, [auth.user?.id]);

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
      Toast.show({
        type: 'success',
        text1: 'Preferences updated!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Try again!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Avatar.Text
          size={100}
          label={getInitials(auth.user?.firstName, auth.user?.lastName)}
          style={styles.avatar}
        />
        <Text variant="headlineMedium" style={styles.name}>
          {capitalizeName(`${auth.user?.firstName} ${auth.user?.lastName}`)}
        </Text>
        <Text style={styles.email}>{auth.user?.email}</Text>

        <Button
          mode="contained"
          style={styles.editButton}
          onPress={() => console.log("Edit Profile")}
        >
          Edit Profile
        </Button>
        <Button
          mode="outlined"
          style={styles.logoutButton}
          onPress={() => auth.logout()}
        >
          Logout
        </Button>
        <Divider style={styles.divider}/>
      </View>


      {/* Preferences Section */}
      <View style={styles.preferencesSection}>
        {/* Fixed Header */}
        <Text variant="headlineMedium" style={styles.preferencesTitle}>
          Update Your Preferences
        </Text>

        {/* Scrollable Preferences */}
        <ScrollView contentContainerStyle={styles.chipContainer}>
          {preferences.map((preference) => (
            <Chip
              key={preference}
              style={[
                styles.chip,
                selectedPreferences.includes(preference) && styles.selectedChip,
              ]}
              onPress={() => togglePreference(preference)}
              selected={false} // Prevent default check mark
            >
              {preference}
            </Chip>
          ))}
        </ScrollView>

        {/* Fixed Footer */}
        <Button
          mode="contained"
          onPress={handleSavePreferences}
          loading={loading}
          disabled={loading}
          style={styles.saveButton}
        >
          Save Preferences
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  email: {
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  editButton: {
    marginTop: 16,
    width: "80%",
  },
  logoutButton: {
    marginTop: 8,
    width: "80%",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 32,
  },
  preferencesSection: {
    maxHeight: "50%",
    width: "100%",
    paddingBottom: 48,
  },
  preferencesTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8, // Keeps gaps between chips
    paddingBottom: 16, // Optional padding for visual spacing at the bottom
  },
  chip: {
    margin: 4,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#f9f9f9",
  },
  selectedChip: {
    borderColor: "#298a47", // Border color for selected state
    backgroundColor: "#e8f5e9", // Light green background for selected state
    borderWidth: 2, // Thicker border for emphasis
  },
  saveButton: {
    marginTop: 16,
    width: "80%",
    alignSelf: "center",
  },
});
