import { styles, primaryColor } from '../MainStyles'
import React, { useEffect, useState } from 'react'
import { Keyboard, View, Text, StyleSheet, Switch, Linking, TouchableOpacity, TextInput, Alert } from "react-native"
import * as Animatable from "react-native-animatable"
import { useNavigation } from "@react-navigation/native"
import { HOST } from '../DataKeys'
import { CreateSession, GetSession } from '../SessionManager'



export default function Login() {

  const nav = useNavigation()

  const [isEnabled, setIsEnabled] = useState(false);
  const [session, setSession] = useState({user: {email: '', access_group: ''}})
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [accessGroup, setAccessGroup] = useState('PRO');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const firstRoute = { 'ALU': 'StudentDash', 'PRO': 'TeacherDash' }

  const login = async () => {

    fetch(`${HOST}/api/users/auth/`, { method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: pass, access_group: accessGroup })
    }).then(resposta => resposta.json()).then( (json) => {
      if(Object.keys(json).includes('erro')){ Alert.alert('Algo não saiu como esperado.', json.erro, [{text: 'OK'},], {cancelable: false}, ) } 
      else {
        // const user = { email: email, access_group: accessGroup, token: json.token }
        CreateSession(json).then(() => nav.navigate(firstRoute[accessGroup]))
      }
    }).catch((error) => {
      Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
    })
  }

  useEffect(() => {
    setAccessGroup(isEnabled ? 'ALU' : 'PRO')
  }, [isEnabled])

  useEffect(() => {
    GetSession().then(response => {
      const data = JSON.parse(response)
      if(data !== null){
        setSession(data)
        nav.navigate(firstRoute[data.user.access_group])
      }
    }).catch((error) => console.log(error))

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    }
  }, [])

  return (
    <View style={styles.container}>

      <Animatable.View animation="fadeInDown" delay={100} style={[styles.headerCard, styles.centralizeContent]}>
        <Animatable.Image animation={'flipInY'} delay={200} source={require('../../assets/images/logo.jpeg')} style={styles.headerCardImage}/>
      </Animatable.View>

      <Animatable.View animation="fadeInRight" delay={400} style={styles.card}>

        <Text style={styles.cardLabel}>Email</Text>
        <TextInput onChangeText={value => setEmail(value)} style={styles.textInput}></TextInput>

        <Text style={styles.cardLabel}>Senha</Text>
        <TextInput secureTextEntry={true} onChangeText={value => setPass(value)} style={styles.textInput}></TextInput>

        <View style={localstyles.accessTypeView}>
          <Text onPress={isEnabled ? toggleSwitch : null} style={[!isEnabled ? localstyles.accessTypeSelectedLabel : localstyles.accessTypeUnselectedLabel, localstyles.accessTypeLabel]} >Professor</Text>

          <Switch
            trackColor={{false: primaryColor, true: primaryColor}}
            thumbColor={primaryColor}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled} />

          <Text onPress={isEnabled ? null : toggleSwitch} style={[isEnabled ? localstyles.accessTypeSelectedLabel : localstyles.accessTypeUnselectedLabel, localstyles.accessTypeLabel]} >Aluno</Text>
        </View>
        

        <TouchableOpacity style={[styles.cardButton, styles.centralizeContent]} onPress={login}>
          <Text style={styles.cardButtonText}>Entrar</Text>
        </TouchableOpacity>

      </Animatable.View>

      {!isKeyboardVisible &&
        <TouchableOpacity onPress={() => Linking.openURL('http://hbassesp.com/privacy/')} style={{position: 'absolute', width: '100%', bottom: 30}}>
          <Text style={{color: primaryColor, textAlign: 'center'}}>Termos de uso e privacidade</Text>
        </TouchableOpacity>
      }

    </View>
  );
}


const localstyles = StyleSheet.create({
  accessTypeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -15,
    marginBottom: 30
  },
  accessTypeLabel: {
    width: 100,
    padding: 10,
    textAlign: 'center',
    borderRadius: 50
  },
  accessTypeSelectedLabel: {
    color: '#fff',
    backgroundColor: primaryColor
  },
  accessTypeUnselectedLabel: {
    color: '#000',
    backgroundColor: '#fff'
  }
});
