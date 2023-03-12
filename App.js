import { StatusBar } from 'expo-status-bar';
import { primaryColor } from './src/MainStyles';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/Routes';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={primaryColor} style="light"/>
      <Routes />
    </NavigationContainer>
  );
}
