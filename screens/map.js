import { StatusBar } from "expo-status-bar";
import react from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Stopwatch } from "react-native-stopwatch-timer";
import MapView, { Polyline, Marker } from "react-native-maps";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { DarkTheme } from "@react-navigation/native";

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const ASPECT_RATIO = width / height;

export default function Map({ navigation }) {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [timer, setTimer] = useState(0);
  const [allow, setAllow] = useState(false);
  const [coords, setCoords] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [canPress, setCanPress] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [startMarker, setStartMarker] = useState();
  const [finish, setFinish] = useState(false);
  const [finishMarker, setFinishMarker] = useState();
  const [clock, setClock] = useState(0)
  const [goBack, setGoBack] = useState(false);
  const [runLog, setRunLog] = useState([{ speed: speed, timer: clock, distance: totalDistance }]);

  useEffect(() => {
    if (totalDistance != 0 && timer != 0) {
      setSpeed(Math.round(3600 * calcSpeed(totalDistance, timer) * 100) / 100);
    }
    if (!allow) {
      requestLocationPermission();
    }
    if (!finish && isRunning) {
      setStartMarker(coords[0]);
    }
  }, [coords]);

  const calcSpeed = (d, t) => {
    return d / t;
  };
  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
    }
    let location = await Location.getCurrentPositionAsync({});
    setPosition(location);
    setAllow(true);
    console.log(location.coords.latitude);
    console.log("test");
    let lat = location.coords.latitude;
    let lon = location.coords.longitude;
    let temp = coords;
    temp.push({ latitude: lat, longitude: lon });
    setCoords(temp);
    setStartMarker(temp);
    //console.log(coords);
  };
  function distance(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const pressHandler = () => {
    navigation.navigate("home", runLog);
  }; //pressHandler
  const addCoords = (c) => {
    if (isRunning) {
      let tempArray = coords;
      let lat = c.latitude;
      let lon = c.longitude;
      tempArray = [...coords, { latitude: lat, longitude: lon }];
      setCoords(tempArray);
      if (coords.length > 0) {
        setTotalDistance(
          Math.round(
            distance(coords[0].latitude, coords[0].longitude, lat, lon) * 100
          ) / 100
        );
        calcSpeed(totalDistance, timer);
      }
    }
  }; //addCoords
  const resetRun = () => {
    setIsRunning(false);
    setGoBack(false)
    setPosition(coords[coords.length - 1]);
    setTotalDistance(0);
    setCoords([]);
    setSpeed(0);
    setTimer(0);
    setFinish(true);
    setCanPress(true);
    setStartMarker(null);
    setFinishMarker(null);
  };
  const startButton = () => {
    if (canPress) {
      setFinish(false);
      setIsRunning(!isRunning);
    }
  };
  const finishHandler = () => {
      let temp = { speed: speed, timer: clock, distance: totalDistance }
      setRunLog(temp);
      setIsRunning(false);
      setFinishMarker(coords[coords.length - 1]);
      setFinish(true);
      setCanPress(false);
      if(goBack){
        pressHandler();
      }
      setGoBack(true)
  };
  return (
    <View style={styles.container}>
      <Stopwatch
        reset={finish}
        start={isRunning}
        getTime={(t) => setClock(t)}
        getMsecs={(t) => setTimer(Math.round(t / 1000))}
      />
      <View style={styles.infoStyle}>
        <View style={styles.dataContainer}>
          <Text style={{ fontSize: 30, color: "white" }}>
            Kilometers: {totalDistance}
          </Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={{ fontSize: 30, color: "white" }}>Km/h: {speed}</Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          userInterfaceStyle={"dark"}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={isRunning}
          onUserLocationChange={(e) => addCoords(e.nativeEvent.coordinate)}
        >
          <Polyline coordinates={coords} strokeColor="blue" strokeWidth={3} />
          {
            <Marker
              title={"Start"}
              pinColor={"green"}
              coordinate={startMarker}
            />
          }

          {finish ? (
            <Marker
              title={"Finish"}
              pinColor={"red"}
              coordinate={finishMarker}
            />
          ) : null}
        </MapView>
      </View>
      {!isRunning ? (
        <TouchableOpacity style={styles.buttonStyleStart} onPress={startButton}>
          <Text style={{ fontSize: 23 }}>Start Run</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.buttonStyleStop} onPress={startButton}>
          <Text style={{ fontSize: 23 }}>Pause</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.resetButton} onPress={resetRun}>
        <Text style={{ fontSize: 23 }}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.endButton} onPress={finishHandler}>
        <Text style={{ fontSize: 23 }}>Finish</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
} //mapPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  infoStyle: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginHorizontal: "5%",
  },
  map: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  mapContainer: { flex: 1, width: "100%", height: "100%" },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "5.5%",
    position: "absolute",
    borderRadius: 50,
    flex: 1,
  },
  resetButtonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "5.5%",
  },
  buttonStyleStart: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#205565",
    width: "25%",
    height: "12.5%",
    borderRadius: 50,
    position: "absolute",
    bottom: "5%",
    margin: "2%",
    borderColor: "black",
  },
  buttonStyleStop: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
    width: "25%",
    height: "12.5%",
    borderRadius: 50,
    position: "absolute",
    bottom: "5%",
    margin: "2%",
    borderColor: "black",
  },
  resetButton: {
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    width: "25%",
    height: "12.5%",
    borderRadius: 50,
    position: "absolute",
    bottom: "5%",
    margin: "2%",
    borderColor: "black",
  },
  endButton: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    width: "25%",
    height: "12.5%",
    borderRadius: 50,
    position: "absolute",
    bottom: "5%",
    margin: "2%",
    borderColor: "black",
  },
  dataContainer: {
    borderColor: "black",
    backgroundColor: "black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 5,
    flexDirection: "row",
    marginTop: "5%",
    width: "80%",
  },
});
