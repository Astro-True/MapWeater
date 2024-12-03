import React, { useState, useEffect, } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Image, Button, Modal, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { LineChart } from "react-native-chart-kit";

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
    "heavy rain": "lluvia torrencial",
    "light snow": "nevada ligera",
    "heavy snow": "nevada intensa",
    "freezing rain": "lluvia congelada",
    "clear": "despejado",
    "overcast clouds": "Nubes nubladas",
};
const kelvinToCelsius = (kelvin: number): string => {
    return kelvin !== undefined ? (kelvin - 273.15).toFixed(1) : "N/A";
};
export default function TabOneScreen() {
    const [weatherData, setWeatherData] = useState<Data | null>(null);
    const [location, setLocation] = useState<LocationType | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [chartModalVisible, setChartModalVisible] = useState(false);



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

    const getTranslatedCondition = (condition: string) => {
        return conditionTranslation[condition] || condition; // Si no se encuentra en el mapeo, se devuelve el original
    };
    const getWeatherIconUrl = (iconCode: string) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL para obtener el ícono en alta resolución
    };
    const getWeatherForTomorrow = () => {
        const tomorrowDate = getTomorrowDate();
        return weatherData?.list.filter((data: any) => getDate(data.dt_txt) === tomorrowDate);
    };
    const getTomorrowDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Incrementar el día actual
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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

    // Configuración del gráfico
    const prepareChartData = () => {
        if (!weatherData) return { labels: [], datasets: [{ data: [] }] };
        const intervals = weatherData.list.slice(0, 8);
        const labels = intervals.map((data: any) => data.dt_txt.split(' ')[1].slice(0, 5));
        const temperatures = intervals.map((data: any) => parseFloat(kelvinToCelsius(data.main.temp)));

        return {
            labels,
            datasets: [{ data: temperatures }],
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



    return (
        <View style={styles.container}>
            <View style={styles.contBtn}>
                <Button title="Ver tu ubicacion" onPress={() => setModalVisible(true)} color="#4CAF50" />
                <Button title="Ver gráfico del clima" onPress={() => setChartModalVisible(true)} color="#4CAF50" />
            </View>
            {/* Modal de ubicación */}
            <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.mapContainer}>
                    {location && (
                        <MapView
                            style={styles.map}
                            region={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        >
                            <Marker coordinate={location} title="Tu ubicación" />
                        </MapView>
                    )}
                </View>
                <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#4CAF50" />
            </Modal>

            {/* Modal de gráfico */}
            <Modal visible={chartModalVisible} animationType="slide" onRequestClose={() => setChartModalVisible(false)}>
                <View style={styles.chartContainer}>
                    {weatherData ? (
                        <LineChart
                            data={prepareChartData()}
                            width={Dimensions.get('window').width}
                            height={356}
                            yAxisLabel="°K "
                            verticalLabelRotation={30}
                            chartConfig={chartConfig}
                            bezier
                            xAxisLabel=" Horas"
                        />
                    ) : (
                        <Text style={styles.loadingText}>Cargando datos del clima...</Text>
                    )}
                </View>
                <Button title="Cerrar" onPress={() => setChartModalVisible(false)} color="#4CAF50" />
            </Modal>
            <View style={styles.modalContainer}>
                <ScrollView>
                    {weatherData ? (
                        //weatherData.list.slice(0, 6).map((data: any, index: number) => (
                        getWeatherForTomorrow()?.map((data, index) => (
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
    chartContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contBtn: {
        backgroundColor: '#0000',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',  // Color de fondo
        paddingVertical: 1,          // Espaciado vertical
        paddingHorizontal: 10,        // Espaciado horizontal
        borderRadius: 8,              // Bordes redondeados
        margin: 10,                  // Espaciado alrededor del botón
        height: 30,
    },
    buttonText: {
        color: '#fff',                // Color del texto
        fontSize: 16,                 // Tamaño de la fuente
        fontWeight: 'bold',           // Negrita
        textAlign: 'center',          // Centrar el texto
    },
});