import { StatusBar } from 'expo-status-bar';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  const handlePressEmail = () => {
    Linking.openURL('mailto:insdelsol@gmail.com');
  };

  const handlePressPhone = () => {
    Linking.openURL('tel:+59162749470'); // Cambia este número por el teléfono real
  };

  const handlePressAddress = () => {
    // URL de Google Maps para buscar la dirección
    Linking.openURL('https://www.google.com/maps/search/Cliza+C%2F+Gualberto+Villarroel+%230071+frente+al+Mercado+Central');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <Text style={styles.title}>Instituto Técnico Del Sol</Text>
        <View style={styles.separator} />

        {/* Email */}
        <TouchableOpacity onPress={handlePressEmail}>
          <Text style={styles.link}>📧 insdelsol@gmail.com</Text>
        </TouchableOpacity>

        {/* Phone */}
        <TouchableOpacity onPress={handlePressPhone}>
          <Text style={styles.link}>📞 (+591) 4789119</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressPhone}>
          <Text style={styles.link}>📱 62749470</Text>
        </TouchableOpacity>

        {/* Address */}
        <TouchableOpacity onPress={handlePressAddress}>
          <Text style={styles.addressText}>📍 Cliza – C/ Gualberto Villarroel #0071 frente al Mercado Central</Text>
        </TouchableOpacity>
      </ImageBackground>

      <Text style={styles.copyText}>
        © {new Date().getFullYear()} Instituto Técnico Del Sol "Inssol". Todos
        los derechos reservados.
      </Text>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Blanco como color de fondo base
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#e67e22', // Naranja
    textAlign: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  separator: {
    marginVertical: 20,
    height: 2,
    width: '80%',
    backgroundColor: '#3498db', // Azul
  },
  link: {
    fontSize: 16,
    color: '#e67e22', // Naranja
    textDecorationLine: 'underline',
    marginVertical: 10,
    textAlign: 'center',
  },
  addressText: {
    fontSize: 14,
    color: '#e67e22', // Naranja
    marginVertical: 10,
    textAlign: 'center',
    textDecorationLine: 'underline', // Hace que se vea como un enlace
  },
  copyText: {
    marginTop: 20,
    fontSize: 14,
    color: '#3498db', // Azul
    textAlign: 'center',
  },
});
