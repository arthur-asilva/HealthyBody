import { StatusBar } from 'expo-status-bar';
import { primaryColor } from './assets/styles/MainStyle';
import { NavigationContainer } from '@react-navigation/native';
// import { DrawerContent } from './src/routes/DrawerContent';
// import * as SecureStore from 'expo-secure-store'

import Routes from "./src/routes"

export default function App() {

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content"/>
      <Routes />
    </NavigationContainer>
  )
}