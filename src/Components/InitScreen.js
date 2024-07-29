import { styles, primaryColor } from '../MainStyles'
import React, { useEffect, useState } from 'react'
import { Keyboard, View, Text, StyleSheet, Switch, Linking, TouchableOpacity, TextInput, Alert } from "react-native"
import * as Animatable from "react-native-animatable"
import { useNavigation } from "@react-navigation/native"



export default function InitScreen() {

  const nav = useNavigation()

  useEffect(() => {
    
  }, [])

  return (
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={[styles.headerCard, styles.centralizeContent]}>
                <Animatable.Image animation={'flipInY'} delay={200} source={require('../../assets/images/logo.jpeg')} style={styles.headerCardImage}/>
            </Animatable.View>

            <Animatable.View animation="fadeInRight" delay={400} style={styles.card}>
                <Text style={{fontSize: 16, color: '#333', textAlign: 'center'}}>Seja bem-vindo à</Text>
                <Text style={{fontSize: 30, color: primaryColor, textAlign: 'center'}}>Healthy Body</Text>
                <Text style={{color: '#333', fontSize: 16, textAlign: 'center'}}>assessoria esportiva, escolha como deseja continuar</Text>

                <TouchableOpacity style={[styles.cardButton, styles.centralizeContent, localstyles.button]} onPress={() => nav.navigate('Login')}>
                    <Text style={styles.cardButtonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cardButton, styles.centralizeContent, localstyles.createAccountButton]} onPress={() => Linking.openURL('http://hbassesp.com/signup/')}>
                    <Text style={[styles.cardButtonText, localstyles.createAccountLabel]}>Criar conta</Text>
                </TouchableOpacity>
            </Animatable.View>


            <TouchableOpacity onPress={() => Linking.openURL('http://hbassesp.com/privacy/')} style={{position: 'absolute', width: '100%', bottom: 30}}>
                <Text style={{color: primaryColor, textAlign: 'center'}}>Termos de uso e privacidade</Text>
            </TouchableOpacity>

        </View>
  );
}

const localstyles = StyleSheet.create({
    button: {
        width: '90%',
        marginTop: 30
    },
    createAccountButton: {
        backgroundColor: '#fff'
    },
    createAccountLabel: {
        color: primaryColor
    }
})