import { StatusBar } from "expo-status-bar";
import react from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Dimensions,
  Image,
  Button,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function home({ navigation }) {
  const pressHandler = () => {
    navigation.navigate("map");
  };

  const [runLog, setRunLog] = useState({speed: navigation.getParam('speed'), distance: navigation.getParam('distance'), time: navigation.getParam('time')})

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 0.1, marginBottom: '20%' }}>
        <Text style={styles.header}>Route Mapper</Text>
      </View>
      <View style={styles.subHeader}>
        <Text style={{ fontWeight: "bold", fontSize: 30 }}>Run Information</Text>
        <View>
          <Text style={{ fontSize: 25 }}>
            Distance: {navigation.getParam('distance')} km
          </Text>
          <Text style={{ fontSize: 25 }}>
            Average Speed: {navigation.getParam('speed')} km/h
          </Text>
          <Text style={{ fontSize: 25 }}>
            Time: {navigation.getParam('timer')}
          </Text>
        </View>
      </View>
      <View style={styles.subHeader}>
        <Text style={{ fontWeight: "bold", fontSize: "30" }}>Directions</Text>
        <View>
          <Text style={{ fontSize: 25 }}>
            Press the Button to start a new run.
            Click 'finish' twice to save your run 
            and return home.
          </Text>
        </View>
      </View>
      <View style={{ flex: 0.3, marginTop: '5%' }}>
        <TouchableOpacity style={styles.button} onPress={pressHandler}>
          <Text style={{ fontSize: 100 }}> + </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    borderColor: "black",
  },
  button: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 100,
    borderColor: "black",
    height: "100%",
  },
  subHeader: {
    alignItems: "flex-start",
  },
});
