import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import axios from 'axios';

//import { Text, View } from '@/components/Themed';
import { Data } from '../models/map';

//const UrlApi = 'api.openweathermap.org/data/2.5/forecast?lat=-65.93253&lon=-17.58777&appid=dfbef9fd443b68f1b4944a7dd0bc141d'
const UrlApi = 'https://api.openweathermap.org/data/2.5/forecast?lat=-65.93253&lon=-17.58777&appid=dfbef9fd443b68f1b4944a7dd0bc141d';


export default function TabOneScreen() {
  //const [weatherData, setWeatherData] = useState({} as Data);
  const [weatherData, setWeatherData] = useState<Data | null>(null);
      // Convertir de Kelvin a Celsius
      const kelvinToCelsius = (kelvin: number): string => {
        return kelvin !== undefined ? (kelvin - 273.15).toFixed(1) : "N/A";
      };
  useEffect(() => {
        axios.get(UrlApi)
          .then(response => {
            //console.log("Datos de clima recibidos:", response.data);
            setWeatherData(response.data);
          })
          .catch(error => {
            //console.error("Error fetching weather data", error);
          });
      }, []);
return (
  <View style={styles.container}>
    <View style={styles.weatherContainer}>
      <Text style={styles.title}>Clima en la región</Text>
      {weatherData ? (
        <>
          <Text style={styles.weatherText}>
            Temperatura: {kelvinToCelsius(weatherData.list[0].main.temp)}°C
          </Text>
          <Text style={styles.weatherText}>
            Condición: {weatherData.list[0].weather[0].description}
          </Text>
        </>
      ) : (
        <Text style={styles.loadingText}>Cargando datos del clima...</Text>
      )}
    </View>
    <View style={styles.mapContainer}>
    <MapView
        style={styles.map}
        initialRegion={{
          latitude: -17.58777,
          longitude: -65.93253,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: -17.58777, longitude: -65.93253 }}
          title="Ubicación"
        />
      </MapView>
    {/* <MapView style={styles.map}></MapView> */}
    </View>
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
  },
  weatherContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weatherText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});