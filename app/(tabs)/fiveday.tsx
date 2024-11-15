import React, { useState, useEffect, Key } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Image, Button, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const API_KEY = 'dfbef9fd443b68f1b4944a7dd0bc141d';
import { Data } from '../models/map';

interface LocationType {
  latitude: number;
  longitude: number;
}

const conditionTranslation: { [key: string]: string } = {
  "clear sky": "cielo despejado",
  "few clouds": "pocas nubes",
  "scattered clouds": "nubes dispersas",
  "broken clouds": "nubes rotas",
  "shower rain": "lluvia ligera",
  "rain": "lluvia",
  "thunderstorm": "tormenta eléctrica",
  "snow": "nieve",
  "mist": "niebla",
  "haze": "neblina",
  "dust": "polvo",
  "fog": "niebla",
  "tornado": "tornado",
  "light rain": "lluvia ligera",
  "drizzle": "llovizna",
  "heavy rain": "lluvia intensa",
  "light snow": "nevada ligera",
  "heavy snow": "nevada intensa",
  "freezing rain": "lluvia congelada",
  "clear": "despejado",
  "overcast clouds": "Nubes nubladas",

};

export default function TabOneScreen() {
  const [weatherData, setWeatherData] = useState<Data | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const kelvinToCelsius = (kelvin: number): string => {
    return kelvin !== undefined ? (kelvin - 273.15).toFixed(1) : "N/A";
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;
      setLocation({ latitude, longitude });
      fetchWeatherData(latitude, longitude);
    } else {
      console.log('Location permission denied');
    }
  };

  const fetchWeatherData = (lat: number, lon: number) => {
    const UrlApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    axios.get(UrlApi)
      .then(response => {
        //console.log("Weather data:", response.data); // Verifica la respuesta completa
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error("Error fetching weather data", error);
      });
  };

  useEffect(() => {
    getLocation();
  }, []);
  const getFiveDayForecast = () => {
    if (!weatherData) return [];
    // Agrupamos por día (cada 8 intervalos aprox. equivale a un día)
    const dailyData = [];
    for (let i = 0; i < weatherData.list.length; i += 8) {
      dailyData.push(weatherData.list[i]);
    }
    return dailyData.slice(0, 5); // Solo los próximos 5 días
  };
  const getSevenDayForecast = () => {
    if (!weatherData) return [];

    // Agrupamos por día (cada 8 intervalos aprox. equivale a un día)
    const dailyData = [];
    for (let i = 0; i < weatherData.list.length; i += 8) {
      dailyData.push(weatherData.list[i]);
    }
    return dailyData.slice(0, 7); // Solo los próximos 7 días
  };

  const getTranslatedCondition = (condition: string) => {
    return conditionTranslation[condition] || condition; // Si no se encuentra en el mapeo, se devuelve el original
  };

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL para obtener el ícono en alta resolución
  };


  //dia
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return daysOfWeek[date.getDay()];
  };
  //fecha
  const getDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  //hora
  const getTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <View style={styles.container}>
      <Button title="Ver tu ubicacion" onPress={() => setModalVisible(true)} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.mapContainer}>
          {location && weatherData && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={location}
                title="Tu ubicación"
                description={getTranslatedCondition(weatherData.list[0].weather[0].description)}
                image={{ uri: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }} // Icono de marcador de Google Maps
              />
            </MapView>
          )}
        </View>
      </Modal>
      <View style={styles.modalContainer}>
        <ScrollView>
          {weatherData ? (
            getFiveDayForecast().map((data, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text style={styles.weatherText}>
                  Día: {getDayOfWeek(data.dt_txt)}
                </Text>
                <Text style={styles.weatherText}>
                  Fecha: {getDate(data.dt_txt)}
                </Text>
                <Text style={styles.weatherText}>
                  Hora: {getTime(data.dt_txt)}
                </Text>
                <Text style={styles.weatherText}>
                  Temperatura: {kelvinToCelsius(data.main.temp)}°C
                </Text>
                <Text style={styles.weatherText}>
                  Humedad: {data.main.humidity}%
                </Text>
                <Text style={styles.weatherText}>
                  Velocidad del viento: {data.wind.speed} m/s
                </Text>
                <Text style={styles.weatherText}>
                  Condición: {getTranslatedCondition(data.weather[0].description)}
                </Text>
                <Image
                  source={{ uri: getWeatherIconUrl(data.weather[0].icon) }}
                  style={styles.weatherIcon}
                />
              </View>
            ))
          ) : (
            <Text style={styles.loadingText}>Cargando datos del clima...</Text>
          )}
        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  dayContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 16,
    textAlign: 'center',
  },
  weatherIcon: {
    width: 50,
    height: 50,
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