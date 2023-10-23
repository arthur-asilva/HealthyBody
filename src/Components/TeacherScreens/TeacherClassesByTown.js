import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { HOST } from "../../DataKeys"
import BottomTabs from '../BottomTabs'





export default function TeacherClassesByTown({ route, navigation }) {

    const localNav = useNavigation()
    const [classes, setClasses] = useState([])
    const [classInDay, setClassInDay] = useState(new Date().getDay() - 1 < 0 ? 6 : new Date().getDay() - 1)
    const [townName, setTownName] = useState('')
    const weekdays = [{number: 0, name: 'Segunda'}, {number: 1, name: 'Terça'}, {number: 2, name: 'Quarta'}, {number: 3, name: 'Quinta'}, {number: 4, name: 'Sexta'}, {number: 5, name: 'Sábado'}, {number: 6, name: 'Domingo'}]

    const getSession = async () => {
        let result = await AsyncStorage.getItem('session')
        return result
    }

    const getData = (token, id) => {
        fetch(`${HOST}/api/user/${token}/client/${id}/`).then(resposta => resposta.json())
            .then( (json) => {
                setClasses(json)
                setTownName(json[0].client_name)
                console.log(classes)
            }).catch((error) => {
                Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
        })
    }

    useEffect(() => {
        getSession().then(response => {
            getData(JSON.parse(response).token, route.params.id)
        })
    }, [])

    useEffect(() => {
        if (route.params?.id) {
            getSession().then(response => {
                getData(JSON.parse(response).token, route.params.id)
            })
        }
    }, [route.params?.id])






    return (
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={styles.headerCard}>
                <Text style={styles.headerCardTitle}>{townName}</Text>
            </Animatable.View>

            <View style={localstyles.scrollViewContainer}>
                <ScrollView style={localstyles.scrollView} horizontal={true}>
                    {
                        weekdays.map((item) =>
                            <View key={item.number} style={localstyles.scrollViewCard}>
                                <Text style={localstyles.scrollCardTitle}>{item.name}</Text>
                                <TouchableOpacity style={localstyles.scrollCardButton} onPress={() => setClassInDay(item.number)}>
                                    <Text style={localstyles.scrollCardButtonText}>Ver turmas</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </ScrollView>
            </View>

            <View style={localstyles.todayClasses}>
                <Text style={localstyles.todayClassesHeader}>{ weekdays.filter(day => day.number == classInDay)[0].name }</Text>
                <ScrollView>

                    {classes.length > 0 &&
                        classes.filter(item => item.weekday.days.includes(classInDay)).map((item) => 
                            <TouchableOpacity key={item.id} style={{flexDirection: 'row', borderColor: '#ccc', borderBottomWidth: 0.5}} onPress={() => localNav.navigate('StudentsByClass', {id: item.id})}>
                                <Text style={localstyles.item}>{item.schedule}</Text>
                                <Text style={localstyles.item}>{item.service}</Text>
                            </TouchableOpacity>
                        )
                    }

                </ScrollView>
            </View>
            <BottomTabs />
        </View>
    );
}



const localstyles = StyleSheet.create({
    scrollViewContainer: {
        width: '100%',
        minHeight: '20%',
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
        height: '100%',
        borderRadius: 10,
        padding: 20,
        marginRight: 15
    },
    scrollCardTitle: {
        fontSize: 20,
        color: primaryColor,
        textTransform: "uppercase"
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
        marginTop: 0,
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
    }
})