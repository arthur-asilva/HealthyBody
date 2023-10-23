import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native'
import BottomTabs from '../BottomTabs'
import { primaryColor, styles } from '../../MainStyles'
import * as Animatable from "react-native-animatable"
import { DeleteSession, GetSession } from '../../SessionManager'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from "@react-navigation/native"
import { HOST } from '../../DataKeys'


export default function ChangePassword(){

    const [session, setSession] = useState({user: {email: '', access_group: ''}})
    const navigation = useNavigation()
    const [image, setImage] = useState('...')

    const [data, setData] = useState({ user: {email: '', token: '', access_group: ''}, new_password: '',  confirm_password: '', valid_password: false })

    useEffect(() => {
        GetSession().then(response => setSession(JSON.parse(response)))
    }, [])

    useEffect(() => { setImage(session.user.photo) }, [session])

    useEffect(() => {
        setData({...data, valid_password: false})
        if(data.new_password != '' && data.confirm_password != '' && data.confirm_password == data.new_password){
            setData({...data, valid_password: true})
        }
    }, [data.new_password, data.confirm_password])

    const changePassword = async () => {
        try{
            if(data.valid_password){
                fetch(`${HOST}/api/user/${session.token}/changepass/`, { method: 'POST',
                    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: session.user.email, new_password: data.new_password, access_group: session.user.access_group })
                }).then(resposta => resposta.json()).then( (json) => {
                    if(!json.erro){
                        Alert.alert('Operação concluída.', 'Você será redirecionado para logar novamente.', [{text: 'OK'},], {cancelable: false}, )
                        DeleteSession().then(() => {
                            navigation.navigate('Login')
                        })
                    }
                }).catch((error) => {
                    Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
                })
            }
        }
        catch(error){ console.log(error) }
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

            <Animatable.View animation="fadeInRight" delay={400} style={styles.card}>

                <Text style={localstyles.formTitle}>Mudança de senha</Text>

                <Text style={styles.cardLabel}>Nova senha</Text>
                <TextInput onChangeText={value => setData({...data, new_password: value})} secureTextEntry={true} style={styles.textInput}></TextInput>

                <Text style={styles.cardLabel}>Confirmar nova senha</Text>
                <TextInput onChangeText={value => setData({...data, confirm_password: value})} secureTextEntry={true} style={styles.textInput}></TextInput>


                { 
                    !data.valid_password && <Text style={{color: '#eb2f06', marginBottom: 10}}>As senhas inseridas precisam ser iguais.</Text>
                }

                <TouchableOpacity onPress={changePassword} disabled={!data.valid_password}  style={[styles.cardButton, styles.centralizeContent, !data.valid_password && localstyles.disabledButton]}>
                    <Text style={styles.cardButtonText}>Salvar</Text>
                </TouchableOpacity>

            </Animatable.View>

            <BottomTabs />
        </View>
    )

}

const localstyles = StyleSheet.create({
    disabledButton: {
        backgroundColor: '#ccc'
    },
    formTitle: {
        color: primaryColor,
        fontSize: 24,
        marginBottom: 20,
        textTransform: 'uppercase'
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
    logout: {
        backgroundColor: '#eb2f06',
        position: 'absolute',
        bottom: 80,
        width: '90%',
        marginHorizontal: '5%',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
})