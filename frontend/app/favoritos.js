import {View, Text, StyleSheet, FlatList} from 'react-native'

import { Colores } from "../src/theme";

const GASOLINERAS_PRUEBA = [
    {id: '1', nombre: 'Escatoil', municipio: 'Reus', direccion: 'Avinguda Carrilet', horario: 'L-D 24h', precio_gasolina_95_e5: 1.567, precio_gasoleo_a: 1.669, precio_gasolina_98_e5: null, precio_gasoleo_premium: null, precio_gases_licuados_petroleo: null},
    {id: '2', nombre: 'Repsol', municipio: 'Cambrils', direccion: 'Calle Argentina', horario: 'L-S 9:00-18:00', precio_gasolina_95_e5: 1.748, precio_gasoleo_a: 1.953, precio_gasolina_98_e5: null, precio_gasoleo_premium: null, precio_gases_licuados_petroleo: null},
]

export default function PantallaFavoritos() {

    const pintarGasolinera = ({item}) => (
        <View>

        </View>
    )

    return (
        // View es el contenedor general de toda la aplicacion
        <View style={estilos.contenedor}>
            <Text style={estilos.titulo}>Lista de Gasolineras Favoritas (Proximamente)</Text>
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
    targeta: {
        backgroundColor: Colores.fondoTargeta,
        padding: 20,
        margin: 10,
        borderRadius: 8,
        borderColor: Colores.bordeTargeta
    },
    titulo: {
        color: Colores.textoClaro,
        fontSize: 20,
        fontWeight: 'bold'
    }
});