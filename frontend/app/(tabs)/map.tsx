import React, { useState, useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps';

export default function MapScreen() {
  const mapRef = useRef(null);

  // Define marker coordinates
  const [markers] = useState<LatLng[]>([
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.78925, longitude: -122.4224 },
    { latitude: 37.78025, longitude: -122.4124 },
  ]);

  const centerMarkers = () => {
    // Check if markers exist
    if (mapRef.current && markers.length > 0) {
      mapRef.current.fitToCoordinates(markers, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
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
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            title={`Marker ${index + 1}`}
            description={`Description for marker ${index + 1}`}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Center Markers" onPress={centerMarkers} />
      </View>
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
});
