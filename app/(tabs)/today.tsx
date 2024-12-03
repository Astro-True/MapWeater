
//const UrlApi = 'api.openweathermap.org/data/2.5/forecast?lat=-65.93253&lon=-17.58777&appid=dfbef9fd443b68f1b4944a7dd0bc141d'
//const UrlApi = 'https://api.openweathermap.org/data/2.5/forecast?lat=-65.93253&lon=-17.58777&appid=dfbef9fd443b68f1b4944a7dd0bc141d';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, Modal, ScrollView, Dimensions, ImageBackground } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { LineChart } from "react-native-chart-kit";
const API_KEY = 'dfbef9fd443b68f1b4944a7dd0bc141d';

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
  "heavy rain": "lluvia torrencial",
  "light snow": "nevada ligera",
  "heavy snow": "nevada intensa",
  "freezing rain": "lluvia congelada",
  "clear": "despejado",
  "overcast clouds": "Nubes nubladas",
};
const getWeatherIconUrl = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL para obtener el ícono en alta resolución
};
const kelvinToCelsius = (kelvin: number): string => {
  return kelvin !== undefined ? (kelvin - 273.15).toFixed(1) : "N/A";
};

const TabOneScreen = () => {
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;
      setLocation({ latitude, longitude });
      fetchWeatherData(latitude, longitude);
      // Iniciar la actualización de ubicación en tiempo real
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 }, // Actualización continua
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );
    } else {
      console.log('Location permission denied');
    }
  };

  const fetchWeatherData = (lat: number, lon: number) => {
    const UrlApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    axios.get(UrlApi)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error("Error fetching weather data", error);
      });
  };
  const getTranslatedCondition = (condition: string) => {
    return conditionTranslation[condition] || condition;
  };
  const getThreeHourIntervalsToday = () => {
    if (!weatherData) return [];
    // Obtener la fecha del día actual
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
    const hourlyData = [];
    for (let i = 0; i < weatherData.list.length; i++) {
      // Obtener la fecha de cada pronóstico
      const forecastDate = weatherData.list[i].dt_txt.split(' ')[0]; // Extraer la fecha (YYYY-MM-DD)
      if (forecastDate === todayDate) {
        hourlyData.push(weatherData.list[i]);
      }
    }
    // Retornar las previsiones de 3 horas para el día actual
    return hourlyData.slice(0, 8); // Tomar las primeras 8 previsiones de 3 horas
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
  const screenWidth = Dimensions.get('window').width;

  interface LocationType {
    latitude: number;
    longitude: number;
  }
  interface ChartData {
    labels: string[];
    datasets: { data: number[] }[];
  }

  // Configuración del gráfico
  const prepareChartData = (): ChartData => {
    const intervals = getThreeHourIntervalsToday();
    const labels = intervals.map((data: any) => data.dt_txt.split(' ')[1].slice(0, 5)); // Horas
    const temperatures = intervals.map((data: any) => parseFloat(kelvinToCelsius(data.main.temp))); // Convertir temperaturas a números

    return {
      labels,
      datasets: [
        {
          data: temperatures,
        },
      ],
    };
  };


  const chartConfig = {
    backgroundGradientFrom: '#0D1B2A', // Fondo superior (azul oscuro)
    backgroundGradientTo: '#1B263B',   // Fondo inferior (azul oscuro más claro)
    decimalPlaces: 0, // Número de decimales en los valores
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Línea azul vibrante
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Etiquetas blancas
    style: {
      borderRadius: 16, // Bordes redondeados
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    propsForDots: {
      r: '3', // Radio de los puntos
      strokeWidth: '2', // Ancho del borde de los puntos
      stroke: '#007BFF', // Borde de los puntos (azul vibrante)
    },
    propsForBackgroundLines: {
      stroke: '#1E3851', // Líneas de fondo (azul tenue)
    },
  };


  useEffect(() => {
    getLocation();
  }, []);
  return (
    <ImageBackground
      source={{ uri: 'https://th.bing.com/th/id/OIP.Uh7i_KXbFEG0TD_-VKcHzgHaNK?rs=1&pid=ImgDetMain' }}
      style={styles.background}
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Clima Actual</Text>
          <View style={styles.modalContainer}>
            <ScrollView>
              {weatherData ? (
                //weatherData.list.slice(0, 6).map((data: any, index: number) => (
                getThreeHourIntervalsToday().map((data, index) => (
                  <View key={index} style={styles.card}>
                    <Text style={styles.tempText}>
                      {new Date(data.dt_txt).toLocaleDateString('es-ES', {
                        weekday: 'long',
                      })}
                    </Text>
                    <Text style={styles.tempText}>
                      {new Date(data.dt_txt).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.tempText}>
                      Hora: {getTime(data.dt_txt)}
                    </Text>
                    <Text style={styles.tempText}>
                      Humedad: {data.main.humidity}%
                    </Text>
                    <Text style={styles.tempText}>
                      Velocidad del viento: {data.wind.speed} m/s
                    </Text>
                    <Image
                      source={{ uri: getWeatherIconUrl(data.weather[0].icon) }}
                      style={styles.weatherIcon}
                    />
                    <Text style={styles.tempText}>
                      {kelvinToCelsius(data.main.temp)}°C
                    </Text>
                    <Text style={styles.conditionText}>
                      {getTranslatedCondition(data.weather[0].description)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.loadingText}>Cargando datos del clima...</Text>
              )}
              <View style={styles.chartContainer}>
                {weatherData ? (
                  <LineChart
                    data={prepareChartData()}
                    width={screenWidth}
                    height={256}
                    verticalLabelRotation={30}
                    chartConfig={chartConfig}
                    bezier
                  />
                ) : (
                  <Text style={styles.loadingText}>Cargando datos del clima...</Text>
                )}
              </View>
            </ScrollView>
            <Button title="Ver tu ubicacion" onPress={() => setModalVisible(true)} />
            <Modal
              visible={modalVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.mapContainer}>
                {location && weatherData && (
                  <MapView
                    style={styles.map}
                    region={{
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
              <Button title="Cerrar" onPress={() => setModalVisible(false)} />
            </Modal>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
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
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 225,
    backgroundColor: '#ffffffdd',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  conditionText: {
    fontSize: 15,
    color: '#666',
  },
  tempText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TabOneScreen;
