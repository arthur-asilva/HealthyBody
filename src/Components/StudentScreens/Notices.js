import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
import { useNavigation } from "@react-navigation/native"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { HOST } from "../../DataKeys"
import { HOST } from '../../DataKeys'
import Icon from 'react-native-vector-icons/FontAwesome'


export default function Notices({ route, navigation }) {

    const [session, setSession] = useState(route.params.session)
    const [notices, setNotices] = useState([])
    const localNav = useNavigation()

    useEffect(() => {
        loadNotices()
    }, [])

    const loadNotices = async () => {
        fetch(`${HOST}/api/user/${session.token}/notices/${session.user.id}/`).then((response) => response.text()).then( (json) => {
            const data = JSON.parse(json)
            setNotices(data.data)
        }).catch((error) => {
            Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
            console.log('this: ', error.message)
        })
    }

    const shortDateFormat = (value) => {
        const data = new Date(value)
        const day = (data.getDate()+1) < 10 ? '0' + (data.getDate()+1) : (data.getDate()+1)
        const month = (data.getMonth() + 1) < 10 ? '0' + (data.getMonth() + 1) : (data.getMonth() + 1)
        const year = data.getFullYear()
        return `${day}/${month}/${year}`
    }

    useEffect(() => {
        if(route.params?.session){
            setSession(route.params.session)
        }
    }, [route.params?.session])


    return(
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={styles.headerCard}>
                <View style={{flexDirection: 'row', marginBottom: -20, alignItems: 'center'}}>
                    <View style={{width: '100%'}}>
                        <Text style={localstyles.headerCardTitle}>Comunicados</Text>
                    </View>
                </View>
            </Animatable.View>
            <Animatable.View>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '90%', marginHorizontal: '5%', marginVertical: 30}}>
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => localNav.navigate('StudentDash', {forceUpdate: new Date().getTime()})}>
                        <Icon name={'home'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Início</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => loadNotices()}>
                        <Icon name={'refresh'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Atualizar</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
            <View style={{width: '90%', marginHorizontal: '5%', paddingVertical: 20}}>
                <ScrollView style={{width: '100%', height: '55%'}}>
                    {notices.length > 0 &&
                        notices.map((item, index) => 
                            <View key={index} style={localstyles.cardWithShadow}>
                                <Text style={{textAlign: 'justify', marginBottom: 10}}>{item.message}</Text>
                                <Text style={{textAlign: 'right'}}>{shortDateFormat(item.created)}</Text>
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const localstyles = StyleSheet.create({
    cardWithShadow: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    },
    bottomButton: {
        width: 60,
        height: 60,
        borderRadius: 100,
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        right: '5%'
    },
    scrollViewCard: {
        width: 250,
        backgroundColor: '#fff',
        height: '100%',
        borderRadius: 10,
        padding: 20,
        marginRight: 15,
        justifyContent: 'center'
    },
    scrollCardButton: {
        paddingHorizontal: 40,
        paddingVertical: 10,
        backgroundColor: primaryColor,
        borderRadius: 6,
        width: '100%'
    },
    scrollCardButtonText: {
        color: '#fff',
        textAlign: 'center'
    },
    typesButtons: {
        backgroundColor: primaryColor,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    typesText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    reportCard: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        padding: '5%',
        marginVertical: 5,
        borderRadius: 3
    },
    isVisible: {
        display: 'flex'
    },
    isInvisible: {
        display: 'none'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: primaryColor,
        marginLeft: 20,
        marginTop: 20,
        textTransform: 'uppercase'
    },
    card: {
        display: 'none',
        backgroundColor: '#fff',
        padding: 20,
        width: '90%',
        marginTop: 10,
        marginHorizontal: '5%',
        borderRadius: 9
    },
    textInput: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        fontSize: 14,
        padding: 5
    },
    headerCardTitle: {
        width: '70%',
        color: '#fff',
        fontSize: 26,
        textTransform: 'uppercase'
    },
    headerCardSubTitle: {
        color: '#fff',
        fontSize: 12,
        textTransform: 'uppercase'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginRight: 20
    },
})
