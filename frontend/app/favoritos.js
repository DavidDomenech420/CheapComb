import {View, Text, StyleSheet, FlatList, LayoutAnimation, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native'
import { useCallback, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import * as Application from 'expo-application'
import * as Location from 'expo-location';

import { Colores } from "../src/theme";

import ModalAlertas from '../components/modalAlertas';
import TarjetaGasolinera  from "../components/tarjetaGasolinera";

// TODO: Si no hay favoritos poner un texto indicando que no hay favoritos para cargar

export default function PantallaFavorito() {
    const [gasolinerasFavoritas, setGasolinerasFavoritas] = useState([])
    const [cargandoDatos, setCargandoDatos] = useState(true)
    const [orden, setOrden] = useState("mix")
    const [latitudUsuario, setLatitudUsuario] = useState(0)
    const [longitudUsuario, setLongitudUsuario] = useState(0)

    // Guardamos el ID de la tarjeta que esta abierta actualmente
    const [idGasolineraAbierta, setIdGasolineraAbierta] = useState(null);

    // Guardamos el ID de la gasolinera que queremos ver las alertas
    const [idGasolineraAlertas, setIdGasolineraAlertas] = useState(null)
    const [popUpAlertasAbierto, setPopUpAlertasAbierto] = useState(false)

    // Funciones 
    useFocusEffect(
        useCallback(() => {
    
            const obtenerDatosServidor = async () => {
                try {                
                    const idUsuario = Application.getAndroidId()
    
                    const gasolinerasFavoritasRaw = await fetch(`https://cheapcombapi.duckdns.org/favoritos/${idUsuario}`);

                    const favoritos = await gasolinerasFavoritasRaw.json()
                    setGasolinerasFavoritas(favoritos)

                    const suscripcionRadar = await Location.watchPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                        distanceInterval: 500,
                        timeInterval: 60000,
                    },
                    // Funcion que se llama cada vez que actualizamos radar
                    (ubicacionActualizada) => {
                        setLatitudUsuario(ubicacionActualizada.coords.latitude)
                        setLongitudUsuario(ubicacionActualizada.coords.longitude)
                    })
                } catch (error) {
                    console.error("Ha habido un error descargando los datos de la API: " + error);
                    
                } finally {
                    setCargandoDatos(false)
                }
            }
            obtenerDatosServidor()
        }, [])
    )

    const calcularDistanciaMetros = (lat1, lon1, lat2, lon2) => {
        const radioTierra = 6371e3; // Radio de la Tierra en metros
        const rad = Math.PI / 180;
        const dLat = (lat2 - lat1) * rad;
        const dLon = (lon2 - lon1) * rad;
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return radioTierra * c; 
    };

    const favoritosOrdenados = [...gasolinerasFavoritas].sort((a, b) => {
        // NOTA: Ajusta "precio_gasolina_95_e5" al combustible que uses por defecto
        const precioA = a.precio_gasolina_95_e5;
        const precioB = b.precio_gasolina_95_e5;
    
        if (orden === 'precio') {
            return precioA - precioB;
        } 
        
        if (orden === 'distancia') {
            const distA = calcularDistanciaMetros(latitudUsuario, longitudUsuario, a.latitud, a.longitud);
            const distB = calcularDistanciaMetros(latitudUsuario, longitudUsuario, b.latitud, b.longitud);
            return distA - distB;
        } 
        
        if (orden === 'mix') {
            const distA = calcularDistanciaMetros(latitudUsuario, longitudUsuario, a.latitud, a.longitud);
            const distB = calcularDistanciaMetros(latitudUsuario, longitudUsuario, b.latitud, b.longitud);
            
            const mixA = (precioA * 1000) + distA;
            const mixB = (precioB * 1000) + distB;
            return mixA - mixB;
        }
        
        return 0;
    });

    const manejarAbrirGasolinera = (id) => {
        // Preparamos la animacion
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (idGasolineraAbierta === id) {
            setIdGasolineraAbierta(null);
        }
        else {
            setIdGasolineraAbierta(id);
        }
    }

    const eliminarFavoritoPantalla = (idGasolineraFav) => {
        const listaActualizada = gasolinerasFavoritas.filter(
            (gasolinera) => gasolinera.id !== idGasolineraFav
        );

        setGasolinerasFavoritas(listaActualizada)
    }

    const abrirAlertasGasolinera = (idGasolineraFav) => {
        setIdGasolineraAlertas(idGasolineraFav)
        setPopUpAlertasAbierto(true)
    }

    

    // Zona Visual

    const pintarGasolinera = ({item}) => (
        <TarjetaGasolinera 
            datosGasolinera={item}
            abierta={idGasolineraAbierta === item.id}
            alternarDesplegable={() => manejarAbrirGasolinera(item.id)
            }
            gasolineraFav={gasolinerasFavoritas.some((favorito) => favorito.id == item.id)}
            paginaFavorito={true}
            quitarFav={eliminarFavoritoPantalla}
            abrirAlertasFav={abrirAlertasGasolinera}
        />
    )

    if (cargandoDatos) {
        return (
            <View style={estilos.contenedor}>
                <ActivityIndicator size="large" color="#2e7d32" />
                <Text style={estilos.titulo}>Buscando Gasolineras...</Text>
            </View>
        );
    }
    
    return (
        // View es el contenedor general de toda la aplicacion
        <View style={estilos.contenedor}>
            <ModalAlertas 
                visible={popUpAlertasAbierto}
                cerrarModal={() => setPopUpAlertasAbierto(false)}
                idGasolinera={idGasolineraAlertas}
                idUsuario={Application.getAndroidId()}
            />
            <View style={estilos.contenedorFiltros}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={estilos.scrollFiltros}
                >
                    {/* Píldora: Precio */}
                    <TouchableOpacity 
                        style={[estilos.pildora, orden === 'precio' && estilos.pildoraActiva]}
                        onPress={() => setOrden('precio')}
                    >
                        <Ionicons name="cash-outline" size={16} color={Colores.textoClaro} />
                        <Text style={[estilos.textoPildora, orden === 'precio' && estilos.textoPildoraActivo]}>
                            Más barato
                        </Text>
                    </TouchableOpacity>

                    {/* Píldora: Distancia */}
                    <TouchableOpacity 
                        style={[estilos.pildora, orden === 'distancia' && estilos.pildoraActiva]}
                        onPress={() => setOrden('distancia')}
                    >
                        <Ionicons name="location-outline" size={16} color={Colores.textoClaro} />
                        <Text style={[estilos.textoPildora, orden === 'distancia' && estilos.textoPildoraActivo]}>
                            Más cercano
                        </Text>
                    </TouchableOpacity>

                    {/* Píldora: Mix (Recomendado) */}
                    <TouchableOpacity 
                        style={[estilos.pildora, orden === 'mix' && estilos.pildoraActiva]}
                        onPress={() => setOrden('mix')}
                    >
                        <Ionicons name="star-outline" size={16} color={Colores.textoClaro} />
                        <Text style={[estilos.textoPildora, orden === 'mix' && estilos.textoPildoraActivo]}>
                            Recomendado
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <FlatList data={favoritosOrdenados} keyExtractor={(item) => item.id} renderItem={pintarGasolinera} />
        </View>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colores.fondo
    },
    titulo: {
        color: Colores.textoClaro,
        fontSize: 20,
        fontWeight: 'bold'
    },
    contenedorFiltros: {
        margin: 5,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: Colores.bordeTargeta,
        maxHeight: 60,
    },
    scrollFiltros: {
        paddingHorizontal: 15, // Da un margen inicial y final al deslizar
        gap: 10, // Separación entre las píldoras
    },
    pildora: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colores.fondo, // Color gris claro de fondo inactivo
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20, // Hace que los bordes sean totalmente redondeados
        borderWidth: 2,
        borderColor: Colores.bordeTargeta,
    },
    pildoraActiva: {
        backgroundColor: Colores.fondoPastilla, // Usa el color principal de tu app (Colores.principal)
        borderColor: Colores.bordeTargeta,
    },
    textoPildora: {
        marginLeft: 6,
        fontSize: 14,
        color: Colores.textoClaro,
        fontWeight: '500',
    },
    textoPildoraActivo: {
        color: Colores.textoClaro,
        fontWeight: 'bold',
    }
});