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
const conditionBackgrounds: { [key: string]: string } = {
    "clear sky": 'https://c1.wallpaperflare.com/preview/804/778/325/sky-background-nature-blue.jpg',
    "few clouds": 'https://th.bing.com/th/id/OIP.tTlRcHQstoM6thXEa8GfSgHaE8?rs=1&pid=ImgDetMain',
    "scattered clouds": 'https://i.pinimg.com/736x/00/6c/31/006c316e5035f8d30a994ebb0e925aa6.jpg',
    "broken clouds": 'https://media.istockphoto.com/photos/cirrocumulus-cloud-picture-id480531006?b=1&k=20&m=480531006&s=170667a&w=0&h=P-RsJJcUXZiF_Ry5LINPjdoiiLU4CnRNxXpwNNgTD6k=',
    "shower rain": 'https://i.pinimg.com/originals/fa/5a/d6/fa5ad6ad927b8be8e67649e1b694cc5a.jpg',
    "rain": 'https://th.bing.com/th/id/R.aceb52fe8e02f2456e8dfabe56cf66d0?rik=EVm1MpbcSIC16g&riu=http%3a%2f%2ffullmeasureofjoy.com%2fwp-content%2fuploads%2f2014%2f05%2fheavy_downpour-450x266.jpg&ehk=1Ezfhl7fj98sUrowKywtSQG3RO7jf05CyPTboWkxXrM%3d&risl=&pid=ImgRaw&r=0',
    "thunderstorm": 'https://services.meteored.com/img/article/tormentas-electricas-fenomenos-meteorologicos-recurrentes-16281-2_1280.jpg',
    "snow": 'https://th.bing.com/th/id/R.6df2d1381124fec512892b77ba3f78d8?rik=8YOMVrmHv0ErCA&riu=http%3a%2f%2ffreedesignfile.com%2fupload%2f2017%2f11%2fSnow-Photoshop-Brushes.jpg&ehk=p6X%2b97AppUbdFfozjhqt%2bMOd2LTx3dMcOL%2byOqAzWyI%3d&risl=&pid=ImgRaw&r=0',
    "mist": 'https://1.bp.blogspot.com/-CsEr7MoiQuo/UPxzuVgqEGI/AAAAAAAAEmM/VvOn2udCLfg/s1600/3.jpg',
    "haze": 'https://i.pinimg.com/736x/6e/3e/c3/6e3ec3336910f06b71d5fdd894792d8d.jpg',
    "dust": 'https://pbs.twimg.com/media/Fi__gC-XEAQx4S3.jpg:large',
    "fog": 'https://1.bp.blogspot.com/-CsEr7MoiQuo/UPxzuVgqEGI/AAAAAAAAEmM/VvOn2udCLfg/s1600/3.jpg',
    "tornado": 'https://th.bing.com/th/id/OIP.ZO4yJOu-RpqnN0AHssnKbQHaEv?rs=1&pid=ImgDetMain',
    "light rain": 'https://th.bing.com/th/id/R.13b0a150f0e37ea7c2e376417319202c?rik=o5lErs98tFTPOw&riu=http%3a%2f%2f2.bp.blogspot.com%2f_b_cFHGnyTNE%2fRwiwtiZlj1I%2fAAAAAAAACnk%2fvgnjPnpxve8%2fs1600%2fVENTANA_LLUVIA.jpg&ehk=ZhgE3Zs2K9yEAKicQ3XigtBkfR0WxXRCeCfhorZABow%3d&risl=&pid=ImgRaw&r=0',
    "drizzle": 'https://th.bing.com/th/id/R.13b0a150f0e37ea7c2e376417319202c?rik=o5lErs98tFTPOw&riu=http%3a%2f%2f2.bp.blogspot.com%2f_b_cFHGnyTNE%2fRwiwtiZlj1I%2fAAAAAAAACnk%2fvgnjPnpxve8%2fs1600%2fVENTANA_LLUVIA.jpg&ehk=ZhgE3Zs2K9yEAKicQ3XigtBkfR0WxXRCeCfhorZABow%3d&risl=&pid=ImgRaw&r=0',
    "heavy rain": 'https://kutv.com/resources/media/41b472ec-4b3c-4fa0-8e4b-65a975cb3ed4-large16x9_Rain.jpg',
    "light snow": "https://th.bing.com/th/id/R.15ef113ca2ff49f497b7a92280b69b1e?rik=l1WKtRHvwtOB1Q&riu=http%3a%2f%2felviento365.com%2fwp-content%2fuploads%2f2016%2f01%2fblizzard.jpg&ehk=HUWodT54cRndi%2fcvT3QYoUKHdzL9OkPW3dOwxSL6RBU%3d&risl=&pid=ImgRaw&r=0",
    "heavy snow": 'https://th.bing.com/th/id/OIP.7ISe9WaEZDLMOcwk5TPXkAHaEo?w=640&h=400&rs=1&pid=ImgDetMain',
    "freezing rain": 'https://www.majestadfm.com/img/post/6e657b78af.jpg',
    "clear": 'https://png.pngtree.com/background/20230409/original/pngtree-clear-sky-white-clouds-blue-sky-background-picture-image_2375515.jpg',
    "overcast clouds": 'https://th.bing.com/th/id/OIP.Uh7i_KXbFEG0TD_-VKcHzgHaNK?rs=1&pid=ImgDetMain',
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
