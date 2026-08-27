import {View, Text, StyleSheet, FlatList, LayoutAnimation, ActivityIndicator} from 'react-native'
import { useEffect, useState } from "react";
import * as Location from 'expo-location';

import { Colores } from "../src/theme";

import TarjetaGasolinera  from "../components/tarjetaGasolinera";

export default function PantallaInicio() {
    const [gasolinerasCercanas, setGasolinerasCercanas] = useState([]);
    const [cargandoDatos, setCargandoDatos] = useState(true)

    // Guardamos el ID de la tarjeta que esta abierta actualmente
    const [idGasolineraAbierta, setIdGasolineraAbierta] = useState(null);

    useEffect(() => {
        
        const obtenerPermisoYUbicacion = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    console.log("Se ha denegado el permiso para la ubicacion");
                    setCargandoDatos(false);
                    return;
                }

                const ubicacionActual = await Location.getCurrentPositionAsync({});
                obtenerDatosServidor(ubicacionActual.coords.latitude, ubicacionActual.coords.longitude)
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
            alternarDesplegable={() => manejarAbrirGasolinera(item.id)}
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
            <FlatList data={gasolinerasCercanas} keyExtractor={(item) => item.id} renderItem={pintarGasolinera} />
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