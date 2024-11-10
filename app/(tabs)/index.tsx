import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';

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
};

const conditionIcons: { [key: string]: string } = {
    "clear sky": "01d",
    "few clouds": "02d",
    "scattered clouds": "03d",
    "broken clouds": "04d",
    "shower rain": "09d",
    "rain": "10d",
    "thunderstorm": "11d",
    "snow": "13d",
    "mist": "50d",
    "haze": "50d",
    "dust": "50d",
    "fog": "50d",
    "tornado": "50d",
    "light rain": "10d",
    "drizzle": "09d",
    "heavy rain": "10d",
    "light snow": "13d",
    "heavy snow": "13d",
    "freezing rain": "09d",
    "clear": "01d",
};

const getWeatherIconUrl = (iconCode: string) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const WeatherConditionList = () => {
    return (
        <ScrollView style={styles.weatherListContainer}>
            {Object.keys(conditionTranslation).map((condition) => (
                <View key={condition} style={styles.weatherCondition}>
                    <Image
                        source={{ uri: getWeatherIconUrl(conditionIcons[condition]) }}
                        style={styles.weatherIcon}
                    />
                    <Text style={styles.weatherConditionText}>
                        {conditionTranslation[condition]}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default function TabOneScreen() {
    return (
        <View style={styles.container}>
            <WeatherConditionList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    weatherListContainer: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    weatherCondition: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    weatherIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    weatherConditionText: {
        fontSize: 16,
    },
});
