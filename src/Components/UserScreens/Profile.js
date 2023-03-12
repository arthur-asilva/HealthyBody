import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import BottomTabs from '../BottomTabs'
import { primaryColor, styles } from '../../MainStyles'
import * as Animatable from "react-native-animatable"
import { DeleteSession, GetSession } from '../../SessionManager'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync } from 'expo-image-manipulator'


export default function Profile(){

    const [user, setUser] = useState({email: '', token: '', access_group: ''})
    const [image, setImage] = useState(null)
    const navigation = useNavigation()

    useEffect(() => {
        GetSession().then(response => setUser(JSON.parse(response)))
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All, allowsEditing: true, aspect: [3, 3], quality: 1
        })
        if (!result.canceled) {
            const prefix = `data:image/${result.assets[0].uri.split('.').slice(-1)[0]};base64,`
            const manipResult = await manipulateAsync(result.assets[0].uri, [{ resize: { width: 300, height: 300 } }], { base64: true, compress: 0.2 })
            setImage(prefix + manipResult.base64)
        }
    }

    const logout = () => {
        Alert.alert('Encerrar a sessão.', 'Tem certeza que deseja continuar?', [{text: 'Cancelar', style: 'cancel'}, {text: 'OK', onPress: () => {
            DeleteSession().then(() => {
                navigation.navigate('Login')
            })
        }}])
    }



    return(
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={styles.headerCard}>
                <View style={{flexDirection: 'row', marginBottom: -20, alignItems: 'center'}}>
                    { image == null && 
                        <Image style={localstyles.image} source={require('../../../assets/images/default_user_icon.png')} />
                    }

                    { image != null && 
                        <Image style={localstyles.image} source={{uri: image}} />
                    }
                    
                    <View>
                        <Text style={localstyles.headerCardTitle}>{user.email.split('@')[0]}</Text>
                        <Text style={localstyles.headerCardSubTitle}>{user.access_group == 'PRO' ? 'Professor' : 'Aluno'}</Text>
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

            <TouchableOpacity style={localstyles.logout} onPress={() => logout()}>
                <Text style={{color: '#fff', marginRight: 10 }}>Sair</Text>
                <Icon name='sign-out' size={20} color={'#fff'} />
            </TouchableOpacity>

            <BottomTabs />
        </View>
    )

}


const localstyles = StyleSheet.create({
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
    logout: {
        backgroundColor: '#eb2f06',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 80,
        left: '5%',
        width: '90%'
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
    }
})