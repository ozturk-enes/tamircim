import { mockMechanics } from "@/constants/mockData";
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = () => {
  const initialRegion = {
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {mockMechanics.map((mechanic) => (
          <Marker
            key={mechanic.id}
            coordinate={{
              latitude: mechanic.location.latitude,
              longitude: mechanic.location.longitude,
            }}
            title={mechanic.name}
            description={mechanic.specialties.join(", ")}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
