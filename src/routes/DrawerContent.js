import React, { useState } from "react"
import { View, Text, StyleSheet, Alert } from "react-native"
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer"
import { Drawer, Avatar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

// LogBox.ignoreLogs(['new NativeEventEmitter'])

export default function DrawerContent() {

  const navigation = useNavigation()

  const logout = () => {
    Alert.alert("Sair do aplicativo", "Tem certeza de que deseja finalizar sua sessão?", [
      {
        text: "Cancelar",
        onPress: () => null,
        style: "cancel"
      },
      { text: "Continuar", onPress: () => navigation.navigate('Logout', {logout: true}) }
    ])
  }

  return (
    <View style={{flex: 1}}>
        <DrawerContentScrollView>
          <View style={{flexDirection: 'row', margin: 15}}>
            <Avatar.Image style={{backgroundColor: '#576574'}} source={{uri: 'https://avatars.githubusercontent.com/u/66978557?s=400&u=d6a459754d69a8205cfcd3a8a647044224f97350&v=4'}} size={70}/>
            <View style={{marginLeft: 15, justifyContent: 'center'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Arthur Silva</Text>
              <Text>Administrador</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginHorizontal: 15, justifyContent: 'space-around'}}>
            <Text style={{color: '#576574'}}>Score: 100</Text>
            <Text style={{color: '#576574'}}>Progresso: 60%</Text>
          </View>
          <Drawer.Section>
            <DrawerItem label={'Controle de usuários'} inactiveTintColor={'#576574'} onPress={ () => {navigation.navigate('UserController')} }></DrawerItem>
            <DrawerItem label={'Controle de condomínios'} inactiveTintColor={'#576574'} onPress={ () => {navigation.navigate('TownhousesController')} }></DrawerItem>
          </Drawer.Section>
        </DrawerContentScrollView>
        <Drawer.Section>
          <DrawerItem label={'Sair'} inactiveTintColor={'#ee5253'} onPress={logout}></DrawerItem>
        </Drawer.Section>
    </View>
  )

}

const style = StyleSheet.create({

})