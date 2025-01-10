import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {filterRestaurantsWithScores, increasePreferenceCount, Restaurant} from '@/api';
import * as Location from 'expo-location';
import {useAuth} from "@/security/AuthProvider";
import Toast from "react-native-toast-message";
import {useTheme} from "react-native-paper";

let debounceTimeout: NodeJS.Timeout | null = null;

const ZOOM_THRESHOLD = 0.1;
let toastTimeout: NodeJS.Timeout | null = null; // Timeout to debounce Toast notifications

export default function Map() {
  const theme = useTheme();

  const mapRef = useRef<MapView>(null);

  const auth = useAuth();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        // Request location permissions
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permissions are required to use this feature.');
          return;
        }

        // Fetch user location
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        // Fetch initial restaurants near user's location
        fetchRestaurants(location.coords.latitude, location.coords.longitude, 5000);
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    fetchUserLocation();
  }, []);

  const computeRadius = (latitudeDelta: number) => {
    // Convert latitudeDelta to radius in meters
    return (latitudeDelta / 2) * 111000;
  };

  const fetchRestaurants = async (latitude: number, longitude: number, radius: number) => {
    if (selectedRestaurant) return;
    setLoading(true); // Start loading

    // Dynamically adjust `size` based on the radius
    const size = Math.min(1000, Math.max(50, Math.floor((radius / 1000) * 10)));

    try {
      const rs = await filterRestaurantsWithScores({latitude, longitude, radius, size});
      rs.content && setRestaurants(rs.content);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleRegionChangeComplete = (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    setRegion(region);

    if (region.latitudeDelta < ZOOM_THRESHOLD) {
      // Clear any existing debounce timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      // Fetch restaurants with debounce
      debounceTimeout = setTimeout(() => {
        const radius = computeRadius(region.latitudeDelta);
        fetchRestaurants(region.latitude, region.longitude, radius);
      }, 750);
    } else {
      // Show Toast message if zoom is not enough
      if (!toastTimeout) {
        Toast.show({
          type: 'info',
          text1: 'Zoom in required',
          text2: 'Please zoom in to see restaurants in this area.',
          position: 'top',
          visibilityTime: 2000,
        });

        // Prevent spamming Toast messages
        toastTimeout = setTimeout(() => {
          toastTimeout = null;
        }, 2000);
      }
    }
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const scoreDiff = (b.recommendationScore || 0) - (a.recommendationScore || 0);
    if (scoreDiff !== 0) return scoreDiff;

    // Secondary sorting by average rating
    const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
    if (ratingDiff !== 0) return ratingDiff;

    // Optional: Tertiary sorting by name for stability
    return a.name?.localeCompare(b.name || "") || 0;
  });


  return (
    <View style={styles.container}>
      {region ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={handleRegionChangeComplete}
            scrollEnabled={!loading} // Disable interaction during loading
            zoomEnabled={!loading} // Disable zoom
            showsUserLocation
            rotateEnabled={false}
            // moveOnMarkerPress={false}
          >
            {sortedRestaurants.map((restaurant, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: restaurant.latitude || 0,
                  longitude: restaurant.longitude || 0,
                }}
                onPress={() => setSelectedRestaurant(restaurant)}
                image={index < 5 ? require('../../assets/images/gold_marker2.png') : null}
                style={{zIndex: index < 5 ? 1000 : index, elevation: index < 5 ? 1000 : index}}
              />
            ))}
          </MapView>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary}/>
              <Text style={styles.loadingText}>Loading restaurants...</Text>
            </View>
          )}
        </>
      ) : (
        <>
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary}/>
            <Text style={styles.loadingText}>Fetching location...</Text>
          </View>
        </>
      )}

      {/* Popup View */}
      {selectedRestaurant && (
        <View style={styles.popup}>
          <TouchableOpacity style={styles.topCloseButton} onPress={() => setSelectedRestaurant(null)}>
            <Text style={styles.topCloseButtonText}>✕</Text>
          </TouchableOpacity>

          <ScrollView>
            <Text style={styles.popupTitle}>{selectedRestaurant.name}</Text>
            {selectedRestaurant.address && (
              <Text style={styles.popupText}>
                <Text style={styles.label}>Address:</Text> {selectedRestaurant.address}
              </Text>
            )}
            {selectedRestaurant.city && (
              <Text style={styles.popupText}>
                <Text style={styles.label}>City:</Text> {selectedRestaurant.city}
              </Text>
            )}
            {selectedRestaurant.country && (
              <Text style={styles.popupText}>
                <Text style={styles.label}>Country:</Text> {selectedRestaurant.country}
              </Text>
            )}
            {selectedRestaurant.openHours && (
              <Text style={styles.popupText}>
                <Text style={styles.label}>Open Hours:</Text> {selectedRestaurant.openHours}
              </Text>
            )}
            {selectedRestaurant.averageRating !== undefined && selectedRestaurant.averageRating !== null && (
              <Text style={styles.popupText}>
                <Text style={styles.label}>Average Rating:</Text> {selectedRestaurant.averageRating.toFixed(1)} ⭐️
              </Text>
            )}
            {selectedRestaurant.totalReviewsCount && (
              <Text style={styles.popupText}>
                <Text style={styles.label}>Reviews:</Text> {selectedRestaurant.totalReviewsCount}
              </Text>
            )}
            {selectedRestaurant.vegan && (
              <Text style={styles.popupText}>🟢 Vegan Options Available</Text>
            )}
            {selectedRestaurant.vegetarian && (
              <Text style={styles.popupText}>🟢 Vegetarian Options Available</Text>
            )}
            {selectedRestaurant.tags && selectedRestaurant.tags.length > 0 && (
              <Text style={styles.popupText}>
                <Text style={styles.label}>Tags:</Text>{' '}
                {selectedRestaurant.tags.map((tag) => tag.name).join(', ')}
              </Text>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.visitButton} onPress={() => {
            increasePreferenceCount({
              userId: auth.user?.id || 0,
              restaurantId: selectedRestaurant?.id || -1
            }).then(() => {
              Toast.show({type: 'success', text1: 'Restaurant marked as liked!'});
              setSelectedRestaurant(null);
            })
          }}>
            <Text style={styles.visitButtonText}>Like</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  popup: {
    position: 'absolute',
    bottom: 75,
    left: 20,
    right: 20,
    maxHeight: 315,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  topCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#E57373',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  topCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  visitButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  visitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
