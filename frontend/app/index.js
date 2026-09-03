import {View, Text, StyleSheet, FlatList, LayoutAnimation, ActivityIndicator} from 'react-native'
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import * as Location from 'expo-location';
import * as Application from 'expo-application'

import { Colores } from "../src/theme";

import TarjetaGasolinera  from "../components/tarjetaGasolinera";

export default function PantallaInicio() {
    const [gasolinerasCercanas, setGasolinerasCercanas] = useState([]);
    const [gasolinerasFavoritas, setGasolinerasFavoritas] = useState([])
    const [cargandoDatos, setCargandoDatos] = useState(true)

    // Guardamos el ID de la tarjeta que esta abierta actualmente
    const [idGasolineraAbierta, setIdGasolineraAbierta] = useState(null);

    const [relojJefe, setRelojJefe] = useState(Date.now());

    useFocusEffect(
        useCallback(() => {
            const obtenerGasolinerasFav = async () => {
                try {
                    const idUsuario = Application.getAndroidId()
                    const gasolinerasFavoritasRaw = await fetch(`https://cheapcombapi.duckdns.org/favoritos/${idUsuario}?tiempo=${Date.now()}`);
                    const favoritos = await gasolinerasFavoritasRaw.json()
                    setGasolinerasFavoritas(favoritos)
                    setRelojJefe(Date.now())
                    
                } catch (error) {
                    console.error("Ha habido un error descargando los datos de la API: " + error);
                }
            }

            obtenerGasolinerasFav()
        }, [])
    )

    useEffect(() => {
        
        let suscripcionRadar = null; // Variable para guardar la conexion con el radar



        const obtenerPermisoYUbicacion = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    console.log("Se ha denegado el permiso para la ubicacion");
                    setCargandoDatos(false);
                    return;
                }

                suscripcionRadar = await Location.watchPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                    distanceInterval: 500,
                    timeInterval: 60000,
                },
                // Funcion que se llama cada vez que actualizamos radar
                (ubicacionActualizada) => {
                    obtenerDatosServidor(ubicacionActualizada.coords.latitude, ubicacionActualizada.coords.longitude)
                }
            )
            } catch (error) {
                
            }
        }

        

        const obtenerDatosServidor = async (latitud, longitud) => {
            try {                
                const respuesta = await fetch(`https://cheapcombapi.duckdns.org/gasolineras/?latitud_usuario=${latitud}&longitud_usuario=${longitud}`);
                const datosMaquetados = await respuesta.json()
                setGasolinerasCercanas(datosMaquetados)


            } catch (error) {
                console.error("Ha habido un error descargando los datos de la API: " + error);
                
            } finally {
                setCargandoDatos(false)
            }

        }
        obtenerPermisoYUbicacion()

        // React ejecuta el return justo antes de destruir el componente.

        return () => {
            if (suscripcionRadar) {
                suscripcionRadar.remove()
            }
        }
    }, [])

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

    const pintarGasolinera = ({item}) => (
        <TarjetaGasolinera 
            datosGasolinera={item}
            abierta={idGasolineraAbierta === item.id}
            alternarDesplegable={() => manejarAbrirGasolinera(item.id)
            }
            gasolineraFav={gasolinerasFavoritas.some((favorito) => favorito.id == item.id)}
            paginaFavorito={false}
            actualizacion={relojJefe}
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
            <FlatList data={gasolinerasCercanas} keyExtractor={(item) => item.id} renderItem={pintarGasolinera} extraData={relojJefe} />
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
});