import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from "react-native-animatable"
import { style, primaryColor } from "../../../assets/styles/MainStyle"
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native"

// LogBox.ignoreLogs(['new NativeEventEmitter'])

export default function BottomMenu() {
    return(
        <Animatable.View animation="fadeInUp" style={localStyle.bottomMenuContainer}>
            <TouchableOpacity style={localStyle.bottomMenuButton}>
                <Ionicons name="add-circle" size={20} color="white" />
                <Text style={localStyle.bottomMenuText}>CRIAR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={localStyle.bottomMenuButton}>
                <Ionicons name="pencil" size={20} color="white" />
                <Text style={localStyle.bottomMenuText}>EDITAR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={localStyle.bottomMenuButton}>
                <Ionicons name="trash" size={20} color="white" />
                <Text style={localStyle.bottomMenuText}>CANCELAR</Text>
            </TouchableOpacity>
        </Animatable.View>
    )
}

const localStyle = StyleSheet.create({
    bottomMenuContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: "space-around",
        padding: 20,
        backgroundColor: primaryColor
    },
    bottomMenuText: {
        color: '#fff',
        fontSize: 12
    },
    bottomMenuButton: {
        alignItems: "center"
    }
})