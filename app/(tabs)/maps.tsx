import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import axios from 'axios';

import { Text, View } from '@/components/Themed';
import { Data } from '../models/map';

//const UrlApi = 'api.openweathermap.org/data/2.5/forecast?lat=-65.93253&lon=-17.58777&appid=dfbef9fd443b68f1b4944a7dd0bc141d'
const UrlApi = 'https://api.openweathermap.org/data/2.5/forecast?lat=-65.93253&lon=-17.58777&appid=dfbef9fd443b68f1b4944a7dd0bc141d';


export default function TabOneScreen() {
  const [weatherData, setWeatherData] = useState({} as Data);
    // Convertir de Kelvin a Celsius
    const kelvinToCelsius = (kelvin:number) => {
      if(kelvin != undefined){
        (kelvin - 273.15).toFixed(1);}
        return kelvin
    };
  useEffect(() => {
        axios.get(UrlApi)
          .then(response => {
            setWeatherData(response.data);
          })
          .catch(error => {
            console.error("Error fetching weather data", error);
          });
      }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab Usuarios</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            {weatherData ? (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>Clima en la región:</Text>
          <Text style={styles.weatherText}>
            Temperatura: {kelvinToCelsius(weatherData.list[0].main.temp)}°C
          </Text>
          <Text style={styles.weatherText}>
            Condición: {weatherData.list[0].weather[0].description}
          </Text>
        </View>
      ) : (
        <Text>Cargando datos del clima...</Text>
      )}
            {/* <MapView style={styles.map} /> */}
            <MapView
        style={styles.map}
        initialRegion={{
          latitude: -65.93253,
          longitude: -17.58777,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude: -65.93253, longitude: -17.58777 }} title="Ubicación" />
      </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    weatherContainer: {
          marginVertical: 20,
          alignItems: 'center',
        },
        weatherText: {
          fontSize: 16,
          fontWeight: 'normal',
        },
});