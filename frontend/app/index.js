import {View, Text, StyleSheet} from 'react-native'

export default function PantallaInicio() {
    return (
        // View es el contenedor general de toda la aplicacion
        <View style={estilos.contenedor}>
            <Text style={estilos.titulo}>Lista de Gasolineras Cercanas (Proximamente)</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#021933'
    },
    titulo: {
        color: '#D8D8D8',
        fontSize: 20,
        fontWeight: 'bold'
    }
});