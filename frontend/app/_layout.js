import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { Image, View, Text } from 'react-native';
import { Colores } from "../src/theme";

export default function NavegacionInferior() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colores.principal,
            tabBarInactiveTintColor: Colores.textoClaro,
            headerStyle: {
                backgroundColor: Colores.barraNavegacion
            },
            tabBarStyle: {
                backgroundColor: Colores.barraNavegacion
            },
            headerTintColor: Colores.textoClaro, // Hace que el título del header sea blanco
            
            // AÑADIMOS EL LOGO AQUÍ
            headerLeft: () => (
                <View style={{ marginLeft: 15, marginRight: 0 }}>
                    <Image 
                        // Ajusta esta ruta dependiendo de dónde guardes la imagen exactamente
                        source={require('../assets/logo.png')} 
                        style={{ width: 60, height: 60, borderRadius: 17.5 }} 
                        resizeMode="contain"
                    />
                </View>
            )
        }}>
            { /* Definimos las diferentes opciones de la barra inferior de navegacion */ }
            <Tabs.Screen
                name='index'
                options={{
                    headerTitle: 'CheapComb',
                    tabBarLabel: 'Gasolineras',
                    tabBarIcon: ({color}) => <Ionicons name='compass' size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name='favoritos'
                options={{
                    title: 'Favoritas',
                    tabBarIcon: ({color}) => <Ionicons name='star' size={24} color={color} />,
                }}
            />
        </Tabs>
    )
}