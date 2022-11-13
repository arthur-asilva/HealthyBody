import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Animatable from "react-native-animatable"
import { style } from "../../../assets/styles/MainStyle"
import { useNavigation } from "@react-navigation/native"

// LogBox.ignoreLogs(['new NativeEventEmitter'])

export default function Login(props) {

  const navigation = useNavigation()

  const login = async () => {
    await AsyncStorage.setItem('session', '1408')
    navigation.navigate('UserController')
  }

  const getSession = async () => {
    let result = await AsyncStorage.getItem('session')
    return result
  }

  const deleteSession = async () => {
    AsyncStorage.clear()
  }

  useEffect(() => {
    if(props.route.name == "Logout"){
      deleteSession()
    } else {
      getSession().then(response => {
        if(response != null){
          navigation.navigate('UserController')
        }
      })
    }
  }, [])

  return (
    <View style={style.container}>

        <Animatable.View animation="fadeInDown" delay={100} style={[style.headerCard, style.centralizeContent]}>
          <Animatable.Image animation={'flipInY'} delay={200} source={require('../../../assets/images/logo.jpeg')} style={style.headerCardImage}/>
        </Animatable.View>

        <Animatable.View animation="fadeInRight" delay={400} style={style.card}>

          <Text style={style.cardLabel}>Email</Text>
          <TextInput style={style.textInput}></TextInput>

          <Text style={style.cardLabel}>Senha</Text>
          <TextInput style={style.textInput}></TextInput>

          <TouchableOpacity style={[style.cardButton, style.centralizeContent]} onPress={login}>
            <Text style={style.cardButtonText}>Entrar</Text>
          </TouchableOpacity>

        </Animatable.View>

    </View>
  );
}