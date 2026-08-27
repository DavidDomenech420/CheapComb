import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { Colores } from "../src/theme";

export default function NavegacionInferior() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colores.principal,
            headerStyle: {
                backgroundColor: Colores.barraNavegacion
            },
            tabBarStyle: {
                backgroundColor: Colores.barraNavegacion
            }
        }}>
            { /* Definimos las diferentes opciones de la barra inferior de navegacion */ }
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Gasolineras',
                    tabBarIcon: ({color}) => <Ionicons name='compass' size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name='favoritos'
                options={{
                    title: 'Favoritas',
                    tabBarIcon: ({color}) => <Ionicons name='star' size={24} color={color} />,
                }}
            />
        </Tabs>
    )
}