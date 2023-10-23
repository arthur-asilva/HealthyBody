import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { HOST } from "../../DataKeys";
import BottomTabs from '../BottomTabs'
import { DeleteSession } from '../../SessionManager'



export default function TeacherDash(props) {

    const navigation = useNavigation()
    const [classes, setClasses] = useState([])
    const [townhouses, setTownhouses] = useState([])
    let weekdayNumber = new Date().getDay() - 1 < 0 ? 0 : new Date().getDay() - 1

    const getSession = async () => {
        let result = await AsyncStorage.getItem('session')
        return result
    }

    useEffect(() => {
        getSession().then(response => {
            if(response != undefined){
                let token = JSON.parse(response).token
            
                fetch(`${HOST}/api/user/teacher/${token}/classes/`)
                    .then(resposta => resposta.json())
                    .then( (json) => {
                        setClasses(json)
                        setTownhouses(getDistinctTownhouses(json))
                    })
                    .catch((error) => {
                        Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK', onPress: () => {
                            DeleteSession().then(() => {
                                navigation.navigate('Login')
                            })
                        }},], {cancelable: false}, )
                    })
            } else {
                Alert.alert('Algo não saiu como esperado.', 'Seu usuário não foi encontrado, tente realizar o login novamente.', [{text: 'OK', onPress: () => {
                    DeleteSession().then(() => {
                        navigation.navigate('Login')
                    }).catch((error) => console.log(error))
                }},], {cancelable: false}, )
            }
        })
    }, [])

    return (
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={styles.headerCard}>
                <Text style={styles.headerCardTitle}>Meus condomínios</Text>
            </Animatable.View>

            <View style={localstyles.scrollViewContainer}>
                <ScrollView style={localstyles.scrollView} horizontal={true}>

                    {
                        townhouses.length > 0 &&
                            townhouses.map((item) =>
                                <View key={item.id} style={localstyles.scrollViewCard}>
                                    <Text style={localstyles.scrollCardTitle}>{item.name}</Text>
                                    <Text style={localstyles.scrollCardAddress}>{item.address}</Text>
                                    <TouchableOpacity style={localstyles.scrollCardButton} onPress={() => {navigation.navigate('TeacherClassesByTown', {id: item.id})}}>
                                        <Text style={localstyles.scrollCardButtonText}>Ver turmas</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                    }

                </ScrollView>
            </View>

            <View style={localstyles.todayClasses}>
                <Text style={localstyles.todayClassesHeader}>Turmas de hoje</Text>
                <ScrollView>
                    {
                        classes.length > 0 &&
                            classes.map((item)=> {
                                if(item.weekday.days.includes(weekdayNumber))
                                    return(
                                        <TouchableOpacity key={item.id} style={{flexDirection: 'row', borderColor: '#ccc', borderBottomWidth: 0.5}} onPress={() => navigation.navigate('StudentsByClass', {id: item.id})}>
                                            <Text style={localstyles.item}>{item.schedule}</Text>
                                            <Text style={localstyles.item}>{item.service}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                    }
                </ScrollView>
            </View>
            
            
            <BottomTabs />

        </View>
    );
}



const getDistinctTownhouses = (data) => {
    let tempData = []
    let result = []
    
    data.forEach(element => {
        if(!tempData.includes(element.client)){
            tempData.push(element.client)
            result.push({id: element.client, name: element.client_name, address: element.client_address})
        }
    })

    return result
}





const localstyles = StyleSheet.create({
    scrollViewContainer: {
        width: '100%',
        minHeight: '40%',
        alignSelf: 'center',
        marginTop: -45,
        paddingVertical: 20,
        paddingHorizontal: 5,
    },
    scrollView: {
        marginHorizontal: 20,
    },
    scrollViewCard: {
        width: 250,
        backgroundColor: '#fff',
        height: '90%',
        borderRadius: 10,
        padding: 20,
        marginRight: 15
    },
    scrollCardTitle: {
        fontSize: 16,
        color: primaryColor,
        fontWeight: 'bold'
    },
    scrollCardAddress: {
        fontSize: 14,
        marginVertical: 15,
        textAlign: 'justify'
    },
    scrollCardButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: primaryColor,
        borderRadius: 6
    },
    scrollCardButtonText: {
        color: '#fff'
    },
    todayClasses: {
        backgroundColor: '#fff',
        padding: 20,
        height: '30%',
        marginTop: -20,
        marginHorizontal: 20,
        borderRadius: 9
    },
    todayClassesHeader: {
        fontSize: 20,
        color: primaryColor,
        fontWeight: 'bold'
    },
    item: {
        padding: 10
    },
    floatButton: {
        width: 50,
        height: 50,
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: primaryColor,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    }
})