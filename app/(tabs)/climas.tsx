import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Button } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const API_KEY = 'dfbef9fd443b68f1b4944a7dd0bc141d';

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
    const [weatherData, setWeatherData] = useState<any | null>(null);
    const [location, setLocation] = useState<LocationType | null>(null);
    const [nearbyLocations, setNearbyLocations] = useState<LocationType[]>([]);
    const [initialLocation, setInitialLocation] = useState<LocationType | null>(null);
    const mapRef = useRef<MapView>(null);
    const kelvinToCelsius = (kelvin: number): string => {
        return kelvin !== undefined ? (kelvin - 273.15).toFixed(1) : "N/A";
    };

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            const userLocation = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = userLocation.coords;
            if (!initialLocation) {
                // Solo se establece una vez la ubicación inicial
                setInitialLocation({ latitude, longitude });
            } updateLocation(latitude, longitude);
        } else {
            console.log('Location permission denied');
        }
    };

    const fetchWeatherData = (lat: number, lon: number) => {
        const UrlApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        axios.get(UrlApi)
            .then(response => {
                setWeatherData(response.data);
                console.log(lat + " : " + lon);
            })
            .catch(error => {
                console.error("Error fetching weather data", error);
            });
    };

    const generateNearbyLocations = (lat: number, lon: number) => {
        const offset = 0.05;
        return [
            { latitude: lat + offset, longitude: lon },
            { latitude: lat - offset, longitude: lon },
            { latitude: lat, longitude: lon + offset },
            { latitude: lat, longitude: lon - offset },
        ];
    };

    const updateLocation = (latitude: number, longitude: number) => {
        setLocation({ latitude, longitude });
        fetchWeatherData(latitude, longitude);
        setNearbyLocations(generateNearbyLocations(latitude, longitude));

        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.150,
                longitudeDelta: 0.150,
            }, 500); // Centra el mapa en la nueva ubicación con una animación
        }
    };

    const resetOrientation = () => {
        if (mapRef.current) {
            mapRef.current.animateCamera({ heading: 0 }, { duration: 500 });
        }
    };

    const returnToInitialLocation = () => {
        if (initialLocation) {
            updateLocation(initialLocation.latitude, initialLocation.longitude);
        }
    };
    useEffect(() => {
        getLocation();
    }, []);

    const getTranslatedCondition = (condition: string) => {
        return conditionTranslation[condition] || condition;
    };

    const getWeatherIconUrl = (iconCode: string) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

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
                            Condición: {getTranslatedCondition(weatherData.list[0].weather[0].description)}
                        </Text>
                        <Text style={styles.weatherText}>
                            Temperatura mínima: {kelvinToCelsius(weatherData.list[0].main.temp_min)}°C
                        </Text>
                        <Text style={styles.weatherText}>
                            Temperatura máxima: {kelvinToCelsius(weatherData.list[0].main.temp_max)}°C
                        </Text>
                        <Text style={styles.weatherText}>
                            Humedad: {weatherData.list[0].main.humidity}%
                        </Text>
                        <Text style={styles.weatherText}>
                            Velocidad del viento: {weatherData.list[0].wind.speed} m/s
                        </Text>
                        <Text style={styles.weatherText}>
                            Visibilidad: {weatherData.list[0].visibility / 1000} km
                        </Text>
                    </>
                ) : (
                    <Text style={styles.loadingText}>Cargando datos del clima...</Text>
                )}
            </View>
            <View style={styles.mapContainer}>
                {location && weatherData && (
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                        onPress={(e) => {
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            updateLocation(latitude, longitude);
                        }}>
                        <Marker
                            draggable
                            coordinate={location}
                            onDragEnd={(e) => {
                                const { latitude, longitude } = e.nativeEvent.coordinate;
                                updateLocation(latitude, longitude);

                            }}
                            title="Tu ubicación"
                            description={getTranslatedCondition(weatherData.list[0].weather[0].description)}
                            image={{ uri: getWeatherIconUrl(weatherData.list[0].weather[0].icon) }}
                        />
                        {/* Icono junto al marcador */}

                        {nearbyLocations.map((loc, index) => {
                            const nearbyWeatherData = weatherData?.list[index];
                            return (
                                <Marker
                                    key={index}
                                    coordinate={loc}
                                    title={`Ubicación cercana ${index + 1}`}
                                    description={getTranslatedCondition(nearbyWeatherData?.weather[0].description || '')}
                                    image={{ uri: getWeatherIconUrl(nearbyWeatherData?.weather[0].icon || '') }}
                                />

                            );
                        })}
                    </MapView>
                )}
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Volver a ubicación inicial" onPress={returnToInitialLocation} color="#1b4f72"/>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Reajustar orientación" onPress={resetOrientation} color="#1b4f72"/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
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
    weatherIcon: {
        position: 'relative',
        top: '50%',
        left: '50%',
        width: 5,
        height: 5,
        transform: [{ translateX: -15 }, { translateY: -15 }],
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5,
        backgroundColor: '#fff',
    },
});
