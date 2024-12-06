import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Image, Button, Modal, ScrollView, ImageBackground, } from 'react-native';
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
    "heavy rain": "lluvia torrencial",
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
            console.log('Permiso de ubicación denegado');
        }
    };
    // Fetch de datos del clima
    const fetchWeatherData = (lat: number, lon: number) => {
        const urlApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        axios.get(urlApi)
            .then((response) => {
                setWeatherData(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener datos del clima", error);
            });
    };

    useEffect(() => {
        getLocation();
    }, []);

    // Pronóstico para 5 días
    const getFiveDayForecast = () => {
        if (!weatherData) return [];
        // Agrupamos por día (cada 8 intervalos aprox. equivale a un día)
        const dailyData = [];
        for (let i = 0; i < weatherData.list.length; i += 8) {
            dailyData.push(weatherData.list[i]);
        }
        return dailyData.slice(0, 5); // Solo los próximos 5 días
    };

    // Traducción de las condiciones
    const getTranslatedCondition = (condition: string) =>
        conditionTranslation[condition] || condition;

    // URL del ícono del clima
    const getWeatherIconUrl = (iconCode: string) =>
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
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
        <ImageBackground
            source={{ uri: 'https://th.bing.com/th/id/OIP.Uh7i_KXbFEG0TD_-VKcHzgHaNK?rs=1&pid=ImgDetMain' }}
            style={styles.background}
        >
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Pronóstico</Text>
                    {weatherData ? (
                        <ScrollView>
                            {getFiveDayForecast().map((data, index) => (
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
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.loadingText}>Cargando datos del clima...</Text>
                    )}
                    <Button title="Ver tu ubicacion" onPress={() => setModalVisible(true)} color="#1b4f72" />
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
                                    }}>
                                    <Marker
                                        coordinate={location}
                                        title="Tu ubicación"
                                        description={getTranslatedCondition(
                                            weatherData.list[0].weather[0].description
                                        )}
                                    />
                                </MapView>
                            )}
                        </View>
                        <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#1b4f72" />
                    </Modal>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
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
    dateText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    tempText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    conditionText: {
        fontSize: 15,
        color: '#666',
    },
    weatherIcon: {
        width: 80,
        height: 50,
        marginVertical: 10,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
