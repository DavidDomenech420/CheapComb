import { Modal, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"

import { Colores } from "../src/theme";

export default function ModalAlertas({visible, cerrarModal, idGasolinera, idUsuario}) {


    // Zona Visual
        return(
            <Modal visible={visible} transparent={true} animationType="fade" >
                <View style={estilos.fondoOscuro}>
                    <View style={estilos.popUp} >
                        <View style={estilos.seccionSuperior}>
                            <Text style={estilos.titulo} >Alerta Esclatoil - Reus</Text>
                            <TouchableOpacity onPress={cerrarModal}>
                                <Ionicons name='close' size={20} color={Colores.textoClaro} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )


}

// Estilos
const estilos = StyleSheet.create({
    fondoOscuro: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    popUp: {
        backgroundColor: Colores.fondoPopUp,
        width: '80%',
        height: '75%',
        borderWidth: 2,
        borderRadius: 8,
        borderColor: Colores.bordeTargeta
    },
    seccionSuperior: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
        alignItems: 'flex-start', // Para que todo quede pegado arriba
        marginBottom: 10,
        width: '100%',
    },
    titulo: {
        color: Colores.textoClaro,
        fontSize: 17,
        fontWeight: 'bold'
    },
})