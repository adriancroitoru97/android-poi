import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Chip, Text } from "react-native-paper";
import Collapsible from "react-native-collapsible";
import { addPreferencesForUser, getAllPreferences } from "@/api";
import { useAuth } from "@/security/AuthProvider";
import { useRouter } from "expo-router";

export default function PreferencesSelection() {
  const auth = useAuth();
  const router = useRouter();
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
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, []);

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
      router.dismissAll();
      router.replace("/");
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
      {Object.entries(preferences).map(([category, tags]) => (
        <View key={category} style={styles.categoryContainer}>
          <TouchableOpacity
            onPress={() => toggleSection(category)}
            style={[styles.categoryButton, { minWidth: "auto" }]} // Dynamically adjusts size
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
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 64,
    paddingBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  categoryContainer: {
    width: "100%",
    marginBottom: 16,
    alignItems: "center", 
  },
  categoryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 8,
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
  },
  chip: {
    margin: 4,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    marginTop: 16,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#298a47",
  },
});
