import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { ActivityIndicator, Image, View , StyleSheet, Text} from 'react-native';
import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage'
import AppIntroSlider from 'react-native-app-intro-slider'

import { Colores } from "../src/theme";

export default function NavegacionInferior() {

    const [mostrarTutorial, setMostrarTutorial] = useState(null)

    useEffect(() => {
        const comprobarPrimeraEntrada = async () => {
            let veterano = await AsyncStorage.getItem('tutorial_completado')
            if (veterano == null) {
                setMostrarTutorial(true)
            } else {
                setMostrarTutorial(false)
            }
        }

        comprobarPrimeraEntrada()
    }, [])
    const diapositivasTutorial = [
        {
            key: '1',
            titulo: 'Bienvenido a CheapComb',
            texto: 'Encuentra tu combustible en la gasolinera mas barata o mas cercana segun tu conviniencia, de la forma mas rapida posible.',
            icono: 'water-outline' // Usaremos Ionicons
        },
        {
            key: '2',
            titulo: 'Añade Gasolineras a Favoritos',
            texto: 'Guarda tus Gasolineras de confianza a Favoritos para tener un rapido acceso a ellas y controlar los precios.',
            icono: 'star-outline' // Usaremos Ionicons
        },
        {
            key: '3',
            titulo: 'Crea tus Alertas',
            texto: 'Enterate cuando un combustible de una gasolinera reduce el precio hasta tu gusto sin necesitar entrar a la aplicación.',
            icono: 'notifications-outline' // Usaremos Ionicons
        },
    ];

    const pintarDiapositiva = ({ item }) => {
        return (
            <View style={estilos.contenedorDiapositiva}>
                <Ionicons name={item.icono} size={100} color={Colores.textoAccentuado} />
                <Text style={estilos.tituloDiapositiva}>{item.titulo}</Text>
                <Text style={estilos.textoDiapositiva}>{item.texto}</Text>
            </View>
        );
    };

    if (mostrarTutorial == null) {
        return (
            <View style={estilos.contenedor}>
                <ActivityIndicator size="large" color="#2e7d32" />
            </View>
        )
    } else if (!mostrarTutorial) {
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
    } else {
        return (
            <AppIntroSlider 
                data={diapositivasTutorial}
                renderItem={pintarDiapositiva}
                onDone={() => {
                    setMostrarTutorial(false)
                    AsyncStorage.setItem('tutorial_completado', 'true')
                }} 
                activeDotStyle={{backgroundColor: Colores.textoAccentuado}}
                dotStyle={{backgroundColor: Colores.textoOscuro}}
                showSkipButton={true}
                onSkip={() => {
                    setMostrarTutorial(false)
                    AsyncStorage.setItem('tutorial_completado', 'true')
                }}
                
                nextLabel="Siguiente"
                doneLabel="Empezar"
                skipLabel="Omitir"
            />
        )
    }
    
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colores.fondo
    },
    contenedorDiapositiva: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colores.fondo,
        paddingHorizontal: 40, // Margen lateral para que el texto respire
    },
    tituloDiapositiva: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colores.textoClaro,
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 20,
    },
    textoDiapositiva: {
        fontSize: 16,
        color: Colores.textoClaro,
        textAlign: 'center',
        lineHeight: 24, // Separa las líneas de texto para mejor lectura
        opacity: 0.9, // Lo hace ligeramente más suave que el título
    }
});