import { Modal, Text, View, StyleSheet, TouchableOpacity, FlatList, TextInput, ToastAndroid, Dimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"

import { Colores } from "../src/theme";
import { useEffect, useState } from "react";


export default function ModalAlertas({visible, cerrarModal, idGasolinera, idUsuario}) {

    const [alertas, setAlertas] = useState([
    ])

    const opcionesCombustible = [
        { id: '1', nombre: 'Gasolina 95 E5' },
        { id: '2', nombre: 'Gasolina 98' },
        { id: '3', nombre: 'Gasoleo A' },
        { id: '4', nombre: 'Gasoleo Premium' },
        { id: '5', nombre: 'Gases Licuados' },

    ];

    const [idSeleccionado, setIdSeleccionado] = useState(opcionesCombustible[0].id);
    const [precioObjetivo, setPrecioObjetivo] = useState("");

    useEffect( () => {
        if (!visible) {
            return;
        }
        const obtenerAlertasGasolinera = async () => {
            const alertasGasolineraRaw = await fetch(`https://cheapcombapi.duckdns.org/favoritos/alertas/${idUsuario}/${idGasolinera}`);

            const alertasGasolinera = await alertasGasolineraRaw.json();
            setAlertas(alertasGasolinera);
            
        }

        obtenerAlertasGasolinera()
    },[idGasolinera, visible])

    const crearAlertaComb = async () => {
        if (precioObjetivo.trim() == "") {
            return null
        }
        let precioFinal = parseFloat(precioObjetivo.replaceAll(",", "."));
        if (isNaN(precioFinal)) {
            return null
        }
        
        try {
            const creacionAlerta = {
                "id_usuario": String(idUsuario), 
                "id_gasolinera": String(idGasolinera), 
                "tipo_combustible": opcionesCombustible.find(combustible => combustible.id === idSeleccionado).nombre,
                "precio_limite": precioFinal
            };

            const respuesta = await fetch(`https://cheapcombapi.duckdns.org/alerta/gasolinera/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(creacionAlerta)
            });

            if (!respuesta.ok) {
                ToastAndroid.show(`Error en la respuesta de la API: ${respuesta.status}`, ToastAndroid.SHORT)
            } else {
                const respuestaMaquetada = await respuesta.json();
                const alertaCreada = {
                    "id": respuestaMaquetada.id_alerta,
                    "tipo_combustible": opcionesCombustible.find(combustible => combustible.id == idSeleccionado).nombre,
                    "precio_objetivo": precioFinal
                };
                setAlertas([...alertas, alertaCreada])
                setPrecioObjetivo("");
            }


        } catch (error) {
            ToastAndroid.show(`Error de red al intentar conectarse: ${error}`, ToastAndroid.SHORT)
        }
    }

    const eliminarAlertaComb = (idAlerta) => {
        idAlerta = parseInt(idAlerta)
        Alert.alert(
            "Eliminar Alerta",
            "¿Estás seguro de que quieres borrar esta alerta?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const respuesta = await fetch(`https://cheapcombapi.duckdns.org/alerta_precio/${idAlerta}`, {
                                method: 'DELETE'
                            });
                
                            if (respuesta.ok) {
                                setAlertas(estadoAnterior => estadoAnterior.filter(alerta => alerta.id_alerta !== idAlerta))
                            }
                        } catch (error) {
                            
                        }
                    } 
                }
            ]
        );
    }
    
    const pintarAlerta = ({item}) => (        
        <View style={estilos.itemAlertaCreada}>
            <Text style={estilos.textoAlertasCreadas}> {item.tipo_combustible} - {item.precio_objetivo} €/L</Text>
            <TouchableOpacity onPress={() => eliminarAlertaComb(item.id_alerta)}>
                <Ionicons name='trash' size={30} color={Colores.eliminar} />
            </TouchableOpacity>
        </View>
    )

    const pintarOpcionCombustible = ({item}) => (
        <View style={estilos.celdaRuleta}>
            {item.id == idSeleccionado ? <Text style={estilos.ruletaSeleccionada}>{item.nombre}</Text> : <Text style={estilos.ruletaSecundario}>{item.nombre}</Text>}
            
        </View>
    )

    const manejarDetectarCombustRuleta = (event) => {
        const desplazamientoY = event.nativeEvent.contentOffset.y;

        const indice = Math.round(desplazamientoY / 40);

        if (opcionesCombustible[indice]) {
            setIdSeleccionado(opcionesCombustible[indice].id);
        }
    }

    // Zona Visual
        return(
            <Modal visible={visible} transparent={true} animationType="fade" >
                <View style={estilos.fondoOscuro}>
                    <View style={estilos.popUp} >
                        <View>
                            <View style={estilos.zonaCerrarPopUp}>
                                <TouchableOpacity onPress={cerrarModal}>
                                    <Ionicons name='close' size={25} color={Colores.textoClaro} />
                                </TouchableOpacity>
                            </View>
                            <View style={estilos.zonaTitulo}>
                                <Text style={estilos.titulo} >Alerta Esclatoil - Reus</Text>
                            </View>
                            <View style={estilos.zonaAlertaCreada}>
                                <FlatList data={alertas} keyExtractor={(item) => item.id_alerta} renderItem={pintarAlerta} showsVerticalScrollIndicator={true} style={{maxHeight: 80}}
                                ListEmptyComponent={
                                    <Text style={estilos.textoVacio}>No hay ninguna alerta para esta gasolinera.</Text>
                                }/>
                            </View>
                            <View style={estilos.divisor} />
                            <View style={estilos.zonaCrearAlerta}>
                                <View style={estilos.ruletaCombustibles}>
                                    <FlatList data={opcionesCombustible} showsVerticalScrollIndicator={false} snapToInterval={40} decelerationRate={"fast"} renderItem={pintarOpcionCombustible} contentContainerStyle={{paddingVertical: 40}} onMomentumScrollEnd={manejarDetectarCombustRuleta} 
                                    />
                                </View>
                                <TextInput style={estilos.inputAlert} keyboardType="decimal-pad" value={precioObjetivo} onChangeText={setPrecioObjetivo} />
                                <Text style={estilos.textoAlertasCreadas}>€/L</Text>
                            </View>
                        </View>
                        <View style={estilos.zonaBotonCrear}>
                            <TouchableOpacity style={estilos.submitAlerta} onPress={crearAlertaComb}>
                                <Text style={estilos.titulo}>Añadir Alerta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )


}

// Estilos
const altoPantalla = Dimensions.get('window').height;
const estilos = StyleSheet.create({
    fondoOscuro: {
        height: altoPantalla,
        width: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    popUp: {
        backgroundColor: Colores.fondoPopUp,
        width: '90%',
        height: altoPantalla * 0.75,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: Colores.bordeTargeta,
        justifyContent: 'space-between',
    },
    zonaCerrarPopUp: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 10,
    },
    zonaTitulo: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        alignItems: 'flex-start', // Para que todo quede pegado arriba
        marginBottom: 20,
        width: '100%',
    },
    titulo: {
        color: Colores.textoClaro,
        fontSize: 22,
        fontWeight: '900'
    },
    zonaAlertaCreada : {
        marginBottom: 30
    },
    itemAlertaCreada: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10
    },
    textoAlertasCreadas: {
        color: Colores.textoClaro,
        fontSize: 17,
    },
    divisor: {
        backgroundColor: Colores.bordeTargeta,
        marginLeft: 20,
        height: 2,
        width: '85%'
    },
    zonaCrearAlerta: {
        marginTop: 70,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight:20,
    },
    ruletaCombustibles: {
        width: '55%',
        height: 120,
        marginLeft: 20
    },
    celdaRuleta: {
        height: 40,
        justifyContent: 'center'
    },
    ruletaSeleccionada: {
        marginLeft: 20,
        color: Colores.textoClaro,
        fontSize: 16,
        fontWeight: 'bold'
    },
    ruletaSecundario: {
        color: Colores.textoClaro,
        opacity: 0.5,
        fontSize: 16
    },
    inputAlert: {
        color: Colores.textoClaro,
        fontSize: 17,
        backgroundColor: '#FFFFFF00',
        borderBottomWidth: 2,
        borderBottomColor: Colores.bordeTargeta,
        width: 80
    },
    submitAlerta: {
        width: '80%',
        backgroundColor: Colores.fondoPastilla,
        borderWidth: 2,
        borderColor: 'black',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'

    },
    zonaBotonCrear: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 15
    },
    textoVacio: {
        color: Colores.textoClaro,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 20,
    },
})