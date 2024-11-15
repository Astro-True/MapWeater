// import { View, Dimensions } from 'react-native';
// import { LineChart } from "react-native-chart-kit";
// const screenWidth = Dimensions.get('window').width;
// const data = {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [
//         {
//             data: [20, 45, 28, 80, 99, 43],
//         }
//     ],
// };
// const chartConfig = {
//     backgroundGradientFrom: '#ffffff',
//     backgroundGradientTo: '#ffffff',
//     decimalPlaces: 2,
//     color: (opacity = 1) => `rgba(0,0,255, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
//     style: {
//         borderRadius: 16,
//     },
// };
// const TabOneScreen = () => {
//     return (
//         <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
//             <LineChart
//                 data={data}
//                 width={screenWidth}
//                 height={256}
//                 verticalLabelRotation={30}
//                 chartConfig={chartConfig}
//                 bezier
//             />
//         </View>
//     )
// }
// export default TabOneScreen;

//const UrlApi = 'api.openweathermap.org/data/2.5/forecast?lat=-65.93253&lon=-17.58777&appid=dfbef9fd443b68f1b4944a7dd0bc141d'
//const UrlApi = 'https://api.openweathermap.org/data/2.5/forecast?lat=-65.93253&lon=-17.58777&appid=dfbef9fd443b68f1b4944a7dd0bc141d';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, Modal, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
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
    "heavy rain": "lluvia intensa",
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
    const [weatherModalVisible, setWeatherModalVisible] = useState(false);

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
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
    };

    useEffect(() => {
        getLocation();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.contBtn}>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Ver tu ubicacion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setWeatherModalVisible(true)}>
                    <Text style={styles.buttonText}>Ver gráfico del clima</Text>
                </TouchableOpacity>
            </View>

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
                <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#4CAF50" />
            </Modal>
            <Modal
                visible={weatherModalVisible}
                animationType="slide"
                onRequestClose={() => setWeatherModalVisible(false)}
            >
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
                <Button title="Cerrar" onPress={() => setWeatherModalVisible(false)} color="#4CAF50" />
            </Modal>

            <View style={styles.modalContainer}>
                <ScrollView>
                    {weatherData ? (
                        //weatherData.list.slice(0, 6).map((data: any, index: number) => (
                        getThreeHourIntervalsToday().map((data, index) => (
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
            </View>
        </View>
    );
};

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

export default TabOneScreen;
