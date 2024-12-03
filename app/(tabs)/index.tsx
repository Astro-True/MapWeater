import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Button, ImageBackground } from 'react-native';

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
const conditionDetails: { [key: string]: { description: string, precipitationTypes: string[] } } = {
    "clear sky": {
        description: "El cielo está completamente despejado, sin nubes.",
        precipitationTypes: ["Ninguna"],
    },
    "few clouds": {
        description: "Hay algunas nubes dispersas, pero el cielo está mayormente despejado.",
        precipitationTypes: ["Lluvia, ligera", "Niebla"],
    },
    "scattered clouds": {
        description: "El cielo tiene nubes dispersas, pero no está completamente cubierto.",
        precipitationTypes: ["Lluvia ligera", "Niebla", "llovizna"],
    },
    "broken clouds": {
        description: "Las nubes están fragmentadas, dejando pasar algo de luz.",
        precipitationTypes: ["Lluvia", "Lluvia intensa", "Tormenta eléctrica"],
    },
    "shower rain": {
        description: "Lluvias ligeras intermitentes o breves.",
        precipitationTypes: ["Lluvia ligera", "Tormenta eléctrica"],
    },
    "rain": {
        description: "Lluvias continuas, pero no muy fuertes.",
        precipitationTypes: ["Lluvia", "Tormenta eléctrica"],
    },
    "thunderstorm": {
        description: "Tormentas eléctricas con lluvia fuerte y rayos.",
        precipitationTypes: ["Lluvia intensa", "Lluvias intermitentes", "Granizo"],
    },
    "snow": {
        description: "Caída de nieve.",
        precipitationTypes: ["Nieve", "Tormenta de nieve"],
    },
    "mist": {
        description: "Visibilidad reducida debido a niebla o vapor de agua.",
        precipitationTypes: ["Niebla", "Lluvia ligera"],
    },
    "haze": {
        description: "Condiciones de visibilidad reducida debido a partículas finas en el aire.",
        precipitationTypes: ["Niebla", "Lluvia ligera"],
    },
    "dust": {
        description: "Tormentas de polvo que reducen la visibilidad.",
        precipitationTypes: ["Polvo", "Viento"],
    },
    "fog": {
        description: "Densa niebla que reduce la visibilidad.",
        precipitationTypes: ["Niebla", "Lluvia ligera"],
    },
    "tornado": {
        description: "Un vórtice de aire violento que forma una columna con el suelo.",
        precipitationTypes: ["Tornado", "Lluvias intermitentes"],
    },
    "light rain": {
        description: "Lluvias leves, de baja intensidad.",
        precipitationTypes: ["Lluvia ligera"],
    },
    "drizzle": {
        description: "Lluvias finas y ligeras, similares a una llovizna.",
        precipitationTypes: ["Lluvia ligera", "Niebla"],
    },
    "heavy rain": {
        description: "Lluvias intensas que pueden provocar inundaciones.",
        precipitationTypes: ["Lluvia intensa", "Tormenta eléctrica"],
    },
    "light snow": {
        description: "Nieve ligera.",
        precipitationTypes: ["Nieve", "Lluvia ligera"],
    },
    "heavy snow": {
        description: "Nieve intensa, puede dificultar la visibilidad y el desplazamiento.",
        precipitationTypes: ["Nieve", "Tormenta de nieve"],
    },
    "freezing rain": {
        description: "Lluvias congeladas que pueden formar una capa de hielo.",
        precipitationTypes: ["Hielo", "Lluvia congelada"],
    },
    "clear": {
        description: "Cielo completamente despejado.",
        precipitationTypes: ["Ninguna"],
    },
    "overcast clouds": {
        description: "Cielo completamente cubierto de nubes.",
        precipitationTypes: ["Lluvia", "Tormenta eléctrica"],
    },
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
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const WeatherConditionList = () => {
    return (
        <ScrollView style={styles.weatherListContainer}>
            <Text style={styles.title}>Descripcion De Cada Ventana</Text>
            <View style={styles.cardText}>
                <Text style={styles.tempText}>
                    Explora el mapa interactivo que te muestra tu ubicación actual y el clima en tiempo real a tu alrededor.
                </Text>
                <Text style={styles.tempText}>
                    - Arrastra el marcador para obtener información del clima en diferentes lugares.
                </Text>
                <Text style={styles.tempText}>
                    - Usa las opciones para regresar a tu ubicación inicial y restaurar la orientación predeterminada.
                </Text>
            </View>

            <View style={styles.cardText}>
                <Text style={styles.tempText}>
                    Consulta el estado del clima del día actual con actualizaciones cada 3 horas.
                </Text>
                <Text style={styles.tempText}>
                    - Incluye un gráfico para visualizar mejor las condiciones.
                </Text>
                <Text style={styles.tempText}>
                    - Recuerda verificar tu ubicación para datos precisos.
                </Text>
            </View>

            <View style={styles.cardText}>
                <Text style={styles.tempText}>
                    Obtén la predicción del clima para mañana, similar al segundo tab.
                </Text>
                <Text style={styles.tempText}>
                    - Incluye estados climáticos con actualizaciones cada 3 horas y gráficos para facilitar la interpretación.
                </Text>
            </View>

            <View style={styles.cardText}>
                <Text style={styles.tempText}>
                    Descubre el pronóstico para los próximos 5 días a partir de mañana.
                </Text>
                <Text style={styles.tempText}>
                    - Los datos se presentan con intervalos de 8 horas para mayor claridad.
                </Text>
            </View>
            <Text style={styles.title}>Tipos De Clima</Text>
            {Object.keys(conditionTranslation).map((condition) => (
                <View key={condition} style={styles.card}>
                    <Image
                        source={{ uri: getWeatherIconUrl(conditionIcons[condition]) }}
                        style={styles.weatherIcon}
                    />
                    <Text style={styles.weatherConditionText}>
                        {conditionTranslation[condition]}
                    </Text>
                    <Text style={styles.descriptionText}>
                        {conditionDetails[condition].description}
                    </Text>
                    <Text style={styles.precipitationText}>
                        Tipos de Precipitación: {conditionDetails[condition].precipitationTypes.join(', ')}
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
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
    },
    weatherListContainer: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    weatherCondition: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    weatherIcon: {
        width: 40,
        height: 40,
        marginRight: 15,
        borderRadius: 50,
    },
    weatherConditionText: {
        fontSize: 16,
        color: '#4A4A4A',
        fontWeight: '500',
    },
    cardText: {
        backgroundColor: '#e9e9e9',
        borderRadius: 20,
        padding: 15,
        marginBottom: 10,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    card: {
        width: '100%',
        backgroundColor: '#ffffffdd',
        borderRadius: 12,
        padding: 20,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tempText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    descriptionText: {
        fontSize: 14,
        color: '#2c3e50',
        fontStyle: 'italic',
        marginTop: 5,
    },
    precipitationText: {
        fontSize: 14,
        color: '#3498db',
        marginTop: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: '300',
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: 20,
        fontStyle: 'italic',
    },
});
