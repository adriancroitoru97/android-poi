import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Avatar, Button, Chip, Divider, Text } from "react-native-paper";
import { useAuth } from "@/security/AuthProvider";
import { addPreferencesForUser, getAllPreferences, getPreferencesByUserId } from "@/api";
import Toast from "react-native-toast-message";
import Collapsible from "react-native-collapsible";

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
  const [preferences, setPreferences] = useState<{ [key: string]: string[] }>({});
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const allPreferences = await getAllPreferences();
        const groupedPreferences = groupPreferences(allPreferences);
        setPreferences(groupedPreferences);

        const userPreferences = await getPreferencesByUserId({ userId: auth.user?.id ?? 0 });
        setSelectedPreferences(userPreferences.map((pref) => pref.preferenceType ?? ""));
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, [auth.user?.id]);

  const groupPreferences = (allPreferences: string[]): { [key: string]: string[] } => {
    const categories = {
      Asia: [
        "Afghani", "Chinese", "Japanese", "Korean", "Thai", "Indian", "Vietnamese",
        "Malaysian", "Singaporean", "Nepalese", "Mongolian", "Tibetan", "Filipino",
        "Pakistani", "Bangladeshi", "SriLankan", "Indonesian", "Uzbek",
        "CentralAsian", "Kazakh", "Kyrgyz",
      ],
      Europe: [
        "Italian", "French", "Spanish", "German", "Greek", "Portuguese", "Dutch",
        "Russian", "Polish", "Ukrainian", "Norwegian", "Swedish", "Danish",
        "British", "Scottish", "Irish", "Austrian", "Swiss", "Czech", "Hungarian",
        "Croatian", "Bosnian", "Albanian", "Serbian", "Bulgarian", "Slovenian",
        "Slovakian", "Romanian", "Georgian", "Armenian", "Basque",
      ],
      America: [
        "American", "Canadian", "Mexican", "Brazilian", "Argentinian",
        "Cuban", "Colombian", "Peruvian", "Jamaican", "Chilean",
        "PuertoRican", "Venezuelan", "Salvadoran", "CostaRican",
        "Guatemalan", "Honduran", "Caribbean", "CentralAmerican",
        "SouthAmerican",
      ],
      MiddleEast: [
        "Arabic", "Lebanese", "Persian", "Israeli", "Turkish",
        "Egyptian", "Moroccan", "Algerian", "Tunisian", "Syrian", "Jordanian",
        "Iraqi", "Kuwaiti", "Saudi", "Yemeni", "Omani",
      ],
      Africa: [
        "Ethiopian", "Nigerian", "SouthAfrican", "Ghanaian", "Kenyan",
        "Tanzanian", "Ugandan", "Senegalese", "Congolese", "Rwandan",
        "Zimbabwean", "Malian", "Burkinabe",
      ],
      Oceania: [
        "Australian", "NewZealand", "Polynesian", "Hawaiian",
      ],
      Vegetarian: [
        "VeganOptions", "VegetarianFriendly", "GlutenFreeOptions", "Halal",
        "Kosher", "MedicinalFoods", "Healthy",
      ],
      Desserts: [
        "Bakeries", "Dessert", "FruitParlours", "JapaneseSweetsParlour",
      ],
      Beverages: [ "Cafe", "WineBar", "BrewPub", "BeerRestaurants",
      ],
      Others: [
        "Fusion", "StreetFood", "FastFood", "FineDining", "QuickBites",
        "Deli", "Seafood", "Pizza", "Barbecue", "Grill", "Pub",
        "Sushi", "Steakhouse", "Soups", "Contemporary", "International",
      ],
    };

    return Object.entries(categories).reduce((acc, [category, tags]) => {
      acc[category] = allPreferences.filter((pref) => tags.includes(pref));
      return acc;
    }, {} as { [key: string]: string[] });
  };

  const togglePreference = (preference: string) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((item) => item !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const toggleSection = (category: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await addPreferencesForUser(
        { listOfPreferences: selectedPreferences },
        { userId: auth.user?.id ?? 0 }
      );
      Toast.show({
        type: "success",
        text1: "Preferences updated!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Try again!",
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

        <Button mode="outlined" style={styles.logoutButton} onPress={() => auth.logout()}>
          Logout
        </Button>
        <Divider style={styles.divider} />
      </View>

      {/* Preferences Section */}
      <ScrollView contentContainerStyle={styles.preferencesSection}>
        {Object.entries(preferences).map(([category, tags]) => (
          <View key={category} style={styles.categoryContainer}>
            <TouchableOpacity
              onPress={() => toggleSection(category)}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedSections[category] ?? true}>
              <View style={styles.chipContainer}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    style={styles.chip}
                    onPress={() => togglePreference(tag)}
                    selected={selectedPreferences.includes(tag)}
                    selectedColor={"#298a47"}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            </Collapsible>
          </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 64,
    backgroundColor: "#fff",
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
    flexGrow: 1,
    paddingBottom: 48,
  },
  categoryContainer: {
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  categoryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: 200, 
    alignItems: "center",
  },
  categoryButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
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
    width: "80%",
    alignSelf: "center",
  },
});
