import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, Linking, TouchableOpacity, Alert, ScrollView } from 'react-native'
import BottomTabs from '../BottomTabs'
import { primaryColor, styles } from '../../MainStyles'
import * as Animatable from "react-native-animatable"
import { DeleteSession, GetSession, SetSession } from '../../SessionManager'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync } from 'expo-image-manipulator'
import { HOST } from '../../DataKeys'


export default function Profile(){

    const [session, setSession] = useState({user: {email: '', access_group: '', skills: {services: []}}})
    const [availability, setAvailability] = useState([])
    const [image, setImage] = useState('...')
    const navigation = useNavigation()

    useEffect(() => {
        GetSession().then(response => {
            setSession(JSON.parse(response))

            const hasAvailability = JSON.parse(response).user

            if(Object.keys(hasAvailability).includes('availability')){
                setAvailability(JSON.parse(response).user.availability.availabilities)
            }

        }).catch(error => console.log(error))
    }, [])

    useEffect(() => {
        setImage(session.user.photo)
    }, [session])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All, allowsEditing: true, aspect: [3, 3], quality: 1
        }).catch((error) => console.log(error))
        if (!result.canceled) {
            const prefix = `data:image/${result.assets[0].uri.split('.').slice(-1)[0]};base64,`
            const manipResult = await manipulateAsync(result.assets[0].uri, [{ resize: { width: 300, height: 300 } }], { base64: true, compress: 0.2 })
            setImage(prefix + manipResult.base64)
            changeProfileImage(prefix + manipResult.base64)
        }
    }

    const logout = () => {
        Alert.alert('Encerrar a sessão.', 'Tem certeza que deseja continuar?', [{text: 'Cancelar', style: 'cancel'}, {text: 'OK', onPress: () => {
          DeleteSession().then(() => {
              navigation.navigate('Login')
          })
        }}])
    }


    const deleteAccount = () => {
        Alert.alert('Excluir conta.', 'Você está tentando excluir sua conta, todos os seus dados serão removidos da nossa base de dados, tem certeza de que deseja continuar?', [{text: 'Cancelar', style: 'cancel'}, {text: 'OK', onPress: () => {
          Linking.openURL(`${HOST}/delete_account/${session.token}/`).then(() => {
            DeleteSession().then(() => {  navigation.navigate('Login')  })
          })
        }}])
    }


    const changeProfileImage = (photo) => {

        let data = { email: session.user.email, photo: photo, access_group: session.user.access_group }

        fetch(`${HOST}/api/user/${session.token}/changephoto/`, { method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(resposta => resposta.json()).then( () => {
            SetSession(photo).then(() => console.log('Atualização de imagem concluída'))
                             .catch((error) => console.log(error))
        }).catch((error) => {
            Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
        })

    }


    return(
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={styles.headerCard}>
                <View style={{flexDirection: 'row', marginBottom: -20, alignItems: 'center'}}>
                    { image === '...' &&
                        <Image style={localstyles.image} source={require('../../../assets/images/default_user_icon.png')} />
                    }

                    { image !== '...' &&
                        <Image style={localstyles.image} source={{uri: image}} />
                    }

                    <View>
                        <Text style={localstyles.headerCardTitle}>{session.user.email.split('@')[0]}</Text>
                        <Text style={localstyles.headerCardSubTitle}>{session.user.access_group == 'PRO' ? 'Professor' : 'Aluno'}</Text>
                    </View>
                </View>
            </Animatable.View>

            <View style={localstyles.containerButtons}>
                <TouchableOpacity style={localstyles.changePassword} onPress={() => navigation.navigate('ChangePassword')}>
                    <Text style={{color: primaryColor, marginRight: 10 }}>Nova senha</Text>
                    <Icon name='lock' size={20} color={primaryColor} />
                </TouchableOpacity>
                <TouchableOpacity style={localstyles.changePassword} onPress={() => pickImage()}>
                    <Text style={{color: primaryColor, marginRight: 10 }}>Nova foto</Text>
                    <Icon name='camera' size={20} color={primaryColor} />
                </TouchableOpacity>
            </View>

            <View style={localstyles.containerPersonalInfo}>
                <Text style={{fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase'}}>{session.user.name}</Text>
                <Text>{session.user.email}</Text>
                <Text>Acesso como: {session.user.access_group == 'PRO' ? 'Professor' : 'Aluno'}</Text>
                {session.user.access_group == 'PRO' &&
                    <>
                        <Text style={{marginTop: 20, fontWeight: 'bold'}}>Especialidades: </Text>
                        <Text>
                            { session.user.skills.services.map((value) => value + '      ') }
                        </Text>
                        <Text style={{marginTop: 20, fontWeight: 'bold'}}>Disponibilidade: </Text>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10, marginTop: 5}}>
                            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((item, index) =>
                                <Text key={index} style={[availability.includes(index.toString()) ? localstyles.availabilityCheck: localstyles.availabilityOptions]}>{item}</Text>
                            )}
                        </View>
                        <Text style={{marginTop: 20, fontWeight: 'bold'}}>Sobre o professor: </Text>
                        <ScrollView style={{height: 100}}>
                            <Text>
                                { session.user.description }
                            </Text>
                        </ScrollView>
                    </>
                }
            </View>

            <View style={localstyles.logoutAndDelete}>

              <TouchableOpacity style={localstyles.delete} onPress={() => deleteAccount()}>
                  <Text style={{color: '#eb2f06', marginRight: 10 }}>Excluir</Text>
                  <Icon name='trash-o' size={20} color={'#eb2f06'} />
              </TouchableOpacity>

              <TouchableOpacity style={localstyles.logout} onPress={() => logout()}>
                  <Text style={{color: '#fff', marginRight: 10 }}>Sair</Text>
                  <Icon name='sign-out' size={20} color={'#fff'} />
              </TouchableOpacity>

            </View>

            {session.user.access_group == 'PRO' &&
                <BottomTabs />
            }
        </View>
    )

}


const localstyles = StyleSheet.create({
    availabilityOptions: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    availabilityCheck: {
        backgroundColor: primaryColor,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#fff',
        borderRadius: 15,
    },
    container: {
        marginTop: 30,
        height: 420,
        width: '90%',
        marginHorizontal: '5%'
    },
    headerCardTitle: {
        color: '#fff',
        fontSize: 24
    },
    headerCardSubTitle: {
        color: '#fff',
        fontSize: 16,
        textTransform: 'uppercase'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginRight: 20
    },
    logoutAndDelete: {
      position: 'absolute',
      bottom: 80,
      width: '90%',
      margin: '5%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    logout: {
        backgroundColor: '#eb2f06',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '40%'
    },
    delete: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '40%'
    },
    changePassword: {
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    containerButtons: {
        marginHorizontal: '5%',
        marginVertical: '5%',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerPersonalInfo: {
        width: '90%',
        marginHorizontal: '5%'
    }
})
