import { useState, useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Login from "../components/Users/Login"
import UserController from "../components/Users/UserController"
import DrawerContent from './DrawerContent'
import TownhousesController from '../components/Townhouses/TownhousesController'

const Stack = createDrawerNavigator()

export default function Routes(){

  return(
    <Stack.Navigator drawerContent={props => <DrawerContent {...props}/>}>

      <Stack.Screen name="Login" component={Login} options={{ headerShown: false, swipeEnabled: false, drawerItemStyle: { height: 0 } }}/>
      <Stack.Screen name="UserController" component={UserController} options={{ headerShown: false, drawerLabel: 'Controle de usuários' }}/>
      <Stack.Screen name="Logout" component={Login} options={{ headerShown: false, swipeEnabled: false }}/>

      <Stack.Screen name="TownhousesController" component={TownhousesController} options={{ headerShown: false, drawerLabel: 'Controle de condomínios' }}/>

    </Stack.Navigator>
  )
}