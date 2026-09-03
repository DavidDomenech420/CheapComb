import {View, Text, StyleSheet, FlatList, LayoutAnimation, ActivityIndicator} from 'react-native'
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from 'expo-router';
import * as Application from 'expo-application'

import { Colores } from "../src/theme";

import ModalAlertas from '../components/modalAlertas';
import TarjetaGasolinera  from "../components/tarjetaGasolinera";

export default function PantallaFavorito() {
    const [gasolinerasFavoritas, setGasolinerasFavoritas] = useState([])
    const [cargandoDatos, setCargandoDatos] = useState(true)

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
    
                } catch (error) {
                    console.error("Ha habido un error descargando los datos de la API: " + error);
                    
                } finally {
                    setCargandoDatos(false)
                }
    
            }
            obtenerDatosServidor()
        }, [])
    )

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
            <FlatList data={gasolinerasFavoritas} keyExtractor={(item) => item.id} renderItem={pintarGasolinera} />
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