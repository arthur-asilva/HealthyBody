import { styles, primaryColor } from '../MainStyles'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput, Alert } from "react-native"
import * as Animatable from "react-native-animatable"
import { useNavigation } from "@react-navigation/native"
import { HOST } from '../DataKeys'
import { CreateSession, GetSession } from '../SessionManager'



export default function Login() {

  const nav = useNavigation()

  const [isEnabled, setIsEnabled] = useState(false);
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [accessGroup, setAccessGroup] = useState('PRO');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const firstRoute = { 'ALU': 'StudentDash', 'PRO': 'TeacherDash' }

  const login = async () => {

    fetch(`${HOST}/api/users/auth/`, { method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: pass, access_group: accessGroup })
    }).then(resposta => resposta.json()).then( (json) => {
      if(Object.keys(json).includes('erro')){ Alert.alert('Algo não saiu como esperado.', json.erro, [{text: 'OK'},], {cancelable: false}, ) } 
      else {
        const user = { email: email, access_group: accessGroup, token: json.token }
        CreateSession(user).then(() => { nav.navigate(firstRoute[accessGroup]) })
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
      if(response != null){
        nav.navigate(firstRoute[JSON.parse(response).access_group])
      }
    })
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
