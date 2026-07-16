import React from "react";

import {

    Alert,

    Button,

    StyleSheet,

    Text,

    View

} from "react-native";

import {

    logout

} from "../../services/authService";

export default function PerfilScreen({

    usuario,

    onLogout

}) {

    async function salir() {

        await logout();

        onLogout();

    }

    return (

        <View style={styles.container}>

            <Text style={styles.nombre}>

                {usuario.nombre}

            </Text>

            <Text>

                {usuario.email}

            </Text>

            <View

                style={{

                    height: 20

                }}

            />

            <Button

                title="Cerrar sesión"

                onPress={() => {

                    Alert.alert(

                        "Salir",

                        "¿Desea cerrar sesión?",

                        [

                            {

                                text: "Cancelar"

                            },

                            {

                                text: "Salir",

                                onPress: salir

                            }

                        ]

                    );

                }}

            />

        </View>

    );

}

const styles = StyleSheet.create({

    container: {

        flex: 1,

        justifyContent: "center",

        alignItems: "center"

    },

    nombre: {

        fontSize: 28,

        fontWeight: "bold"

    }

});