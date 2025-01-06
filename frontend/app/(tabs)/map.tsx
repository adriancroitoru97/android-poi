import React, {useEffect, useRef, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {getRestaurants, Restaurant} from '@/api';

export default function Map() {
  const mapRef = useRef<MapView>(null);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const rs = await getRestaurants();
        setRestaurants(rs);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const centerMarkers = () => {
    if (restaurants.length > 0) {
      mapRef.current?.fitToCoordinates(
        restaurants.map((r) => ({
          latitude: r.latitude || 0,
          longitude: r.longitude || 0,
        })),
        {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {restaurants.map((restaurant, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: restaurant.latitude || 0,
              longitude: restaurant.longitude || 0,
            }}
            title={restaurant.name}
            description={restaurant.address}
            onPress={() => setSelectedRestaurant(restaurant)}
          />
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Center Markers" onPress={centerMarkers}/>
      </View>

      {/* Popup View */}
      {selectedRestaurant && (
        <View style={styles.popup}>
          {/* Close Button at the Top */}
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
            {selectedRestaurant.averageRating !== undefined && (
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

          {/* Visit Button */}
          <TouchableOpacity style={styles.visitButton} onPress={() => {
          }}>
            <Text style={styles.visitButtonText}>Visit</Text>
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  linkText: {
    color: '#fff',
    textAlign: 'center',
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
    zIndex: 1, // Ensures the button is above other elements
  },
  topCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  visitButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 8, // Reduced vertical padding
    paddingHorizontal: 15, // Added horizontal padding for balance
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start', // Makes the button smaller by not stretching across the container
  },
  visitButtonText: {
    color: '#fff',
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
  },
});
