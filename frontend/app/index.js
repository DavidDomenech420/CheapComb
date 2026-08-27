import {View, Text, StyleSheet, FlatList, LayoutAnimation} from 'react-native'
import { useState } from "react";

import { Colores } from "../src/theme";

import TarjetaGasolinera  from "../components/tarjetaGasolinera";

const GASOLINERAS_PRUEBA = [
    {id: '1', nombre: 'Escatoil', municipio: 'Reus', direccion: 'Avinguda Carrilet', horario: 'L-D 24h', precio_gasolina_95_e5: 1.567, precio_gasoleo_a: 1.669, precio_gasolina_98_e5: null, precio_gasoleo_premium: null, precio_gases_licuados_petroleo: null},
    {id: '2', nombre: 'Repsol', municipio: 'Cambrils', direccion: 'Calle Argentina', horario: 'L-S 9:00-18:00', precio_gasolina_95_e5: 1.748, precio_gasoleo_a: 1.953, precio_gasolina_98_e5: null, precio_gasoleo_premium: 2.124, precio_gases_licuados_petroleo: null},
]


export default function PantallaInicio() {

    // Guardamos el ID de la tarjeta que esta abierta actualmente
    const [idGasolineraAbierta, setIdGasolineraAbierta] = useState(null);

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

    return (
        // View es el contenedor general de toda la aplicacion
        <View style={estilos.contenedor}>
            <FlatList data={GASOLINERAS_PRUEBA} keyExtractor={(item) => item.id} renderItem={pintarGasolinera} />
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
    
});