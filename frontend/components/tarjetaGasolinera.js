import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"
import * as Application from 'expo-application'

import { Colores } from "../src/theme";

export default function TarjetaGasolinera({ datosGasolinera, abierta, alternarDesplegable }) {

    const [favorito, setFavorito] = useState(false);

    const alternarFavorito = async () => {
        setFavorito(!favorito);
        !favorito ? ToastAndroid.show(`${datosGasolinera.nombre} se ha añadido a favoritos`, ToastAndroid.SHORT): ToastAndroid.show(`${datosGasolinera.nombre} se ha eliminado de favoritos`, ToastAndroid.SHORT)

        const idUsuario = await Application.getAndroidId()

        if (!favorito) {
            try {
                const datosFav = {
                    id_usuario: idUsuario,
                    id_gasolinera: datosGasolinera.id
                }
                const respuesta = await fetch(`https://cheapcombapi.duckdns.org/gasolineras_favoritas/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosFav)
                });

                if (!respuesta.ok) {
                    ToastAndroid.show(`Error en la respuesta de la API: ${respuesta.status}`, ToastAndroid.SHORT)
                    setFavorito(favorito)
                }
            } catch (error) {
                ToastAndroid.show(`Error de red al intentar conectarse: ${error}`, ToastAndroid.SHORT)
                
            }
        } else {
            try {
                const datosFav = {
                    id_dispositivo: idUsuario
                }
                const respuesta = await fetch(`https://cheapcombapi.duckdns.org/gasolineras_favoritas/${datosGasolinera.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json', // Le decimos a la API qué tipo de dato enviamos
                    },
                    body: JSON.stringify(datosFav)
                })
                if (!respuesta.ok) {
                    ToastAndroid.show(`Error en la respuesta de la API: ${respuesta.status}`, ToastAndroid.SHORT)
                    setFavorito(favorito)
                }
            } catch (error) {
                ToastAndroid.show(`Error de red al intentar conectarse: ${error}`, ToastAndroid.SHORT)
                
            }
        }
    }
    return (
        <View style={estilos.tarjeta}>
            {/* Seccion Superior */}
            <View style={estilos.seccionSuperior}>
                {/* Informacion Gasolinera Basico */}
                <View style={estilos.columnaIzquierda}>
                    <View style={estilos.filaTitulo}>
                        <TouchableOpacity onPress={alternarFavorito}>
                            <Text style={estilos.iconoEstrella}>{favorito ? <Ionicons name='star'size={20} color='yellow' /> : <Ionicons name='star-outline' size={20} color={Colores.textoClaro} />}</Text>
                        </TouchableOpacity>
                        <Text style={estilos.titulo}>{datosGasolinera.nombre}</Text>
                    </View>
                    <Text style={estilos.textoSecundario}>{datosGasolinera.direccion}, {datosGasolinera.municipio}</Text>
                    <Text style={estilos.textoSecundario}>{datosGasolinera.horario}</Text>
                </View>

                {/* Precios Combustibles */}
                <View style={estilos.columnaDerecha}>

                    {datosGasolinera.precio_gasolina_95_e5 && (
                        <View style={estilos.pastillaPrecio}>
                            <View style={estilos.pastillaMitadIzquierda}>
                                <Text style={estilos.textoCombustible}>Gasolina 95</Text>
                            </View>
                            <View style={estilos.pastillaMitadDerecha}>
                                <Text style={estilos.textoPrecio}>{datosGasolinera.precio_gasolina_95_e5} €/L</Text>
                            </View>
                        </View>
                    )}
                    
                    {datosGasolinera.precio_gasoleo_a && (
                        <View style={estilos.pastillaPrecio}>
                            <View style={estilos.pastillaMitadIzquierda}>
                                <Text style={estilos.textoCombustible}>Gasoleo A</Text>
                            </View>
                            <View style={estilos.pastillaMitadDerecha}>
                                <Text style={estilos.textoPrecio}>{datosGasolinera.precio_gasoleo_a} €/L</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {/* Seccion Oculta Precios Combustibles*/}
            {abierta && (
                <View>
                    <View style={estilos.columnaDerecha}>
                        {datosGasolinera.precio_gasolina_98 && (
                            <View style={estilos.pastillaPrecio}>
                                <View style={estilos.pastillaMitadIzquierda}>
                                    <Text style={estilos.textoCombustible}>Gasolina 98</Text>
                                </View>
                                <View style={estilos.pastillaMitadDerecha}>
                                    <Text style={estilos.textoPrecio}>{datosGasolinera.precio_gasolina_98} €/L</Text>
                                </View>
                            </View>
                        )}

                        {datosGasolinera.precio_gasoleo_premium && (
                            <View style={estilos.pastillaPrecio}>
                                <View style={estilos.pastillaMitadIzquierda}>
                                    <Text style={estilos.textoCombustible}>Gasoleo Premium</Text>
                                </View>
                                <View style={estilos.pastillaMitadDerecha}>
                                    <Text style={estilos.textoPrecio}>{datosGasolinera.precio_gasoleo_a} €/L</Text>
                                </View>
                            </View>
                        )}
                        {datosGasolinera.precio_gases_licuados_petroleo && (
                            <View style={estilos.pastillaPrecio}>
                                <View style={estilos.pastillaMitadIzquierda}>
                                    <Text style={estilos.textoCombustible}>Gases Licuados del Petroleo</Text>
                                </View>
                                <View style={estilos.pastillaMitadDerecha}>
                                    <Text style={estilos.textoPrecio}>{datosGasolinera.precio_gases_licuados_petroleo} €/L</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            )}
            {/* Pie de tarjeta */}
            <View style={estilos.pieTarjeta}>
                <TouchableOpacity>
                    <Text style={estilos.enlaceAccion}>Como llegar →</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={alternarDesplegable}>
                    <Text style={estilos.enlaceAccion}>{abierta ? 'Ver Menos ⌃' : 'Ver Más ⌄'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const estilos = StyleSheet.create({
    tarjeta: {
        backgroundColor: Colores.fondoTargeta,
        padding: 8,
        paddingTop: 10,
        paddingBottom: 10,
        margin: 20,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: Colores.bordeTargeta,
        overflow: 'hidden',
    },
    titulo: {
        color: Colores.textoClaro,
        fontSize: 17,
        fontWeight: 'bold'
    },
    iconoEstrella: {
        fontSize: 20
    },
    textoSecundario: { 
        color: Colores.textoClaro,
        fontSize: 12, 
        fontWeight: 'bold',
    },
    enlaceAccion: {
        color: Colores.textoAccentuado,
        fontSize: 12
    },
    textoPrecio: { 
        color: Colores.textoClaro,
        fontSize: 16,
        fontWeight: 'bold'
    },
    textoCombustible: {
        color: Colores.textoClaro,
        fontSize: 14,
    },
    seccionSuperior: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        alignItems: 'flex-start', // Para que todo quede pegado arriba
        marginBottom: 10,
        width: '100%',
    },
    columnaIzquierda: {
        flex: 1, 
        marginRight: 20,
    },
    columnaDerecha: {
        alignItems: 'flex-end',
    },
    pieTarjeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    filaTitulo: {
        flexDirection: 'row',
        alignItems: 'center', // Centra la estrella y el texto verticalmente
        marginBottom: 8,
        gap: 8,
    },

    // LA MAGIA DE LA PASTILLA
    pastillaPrecio: {
        flexDirection: 'row',
        width: 210,
        backgroundColor: Colores.fondoPastilla,
        borderWidth: 2,
        borderColor: Colores.bordeTargeta, // Aquí iría tu color
        borderRadius: 4,
        marginBottom: 12,
    },
    pastillaMitadIzquierda: {
        flex: 1,
        padding: 8,
        borderRightWidth: 1, // La línea separadora del medio
        borderRightColor: Colores.bordeTargeta,
    },
    pastillaMitadDerecha: {
        width: 100,
        padding: 8,
        alignItems: 'flex-end', // Empuja el precio a la derecha
    }
});