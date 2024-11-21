import React, {useRef, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import MapView, {LatLng, Marker} from 'react-native-maps';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

  const [markers] = useState<LatLng[]>([
    {latitude: 37.78825, longitude: -122.4324},
    {latitude: 37.78925, longitude: -122.4224},
    {latitude: 37.78025, longitude: -122.4124},
  ]);

  const centerMarkers = () => {
    if (markers.length > 0) {
      mapRef.current?.fitToCoordinates(markers, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
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
        <Button title="Center Markers" onPress={centerMarkers}/>
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
