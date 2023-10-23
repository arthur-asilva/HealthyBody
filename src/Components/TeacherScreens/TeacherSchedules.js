import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from "@react-navigation/native"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { HOST } from "../../DataKeys"
import { HOST } from '../../DataKeys'
import { GetSession } from '../../SessionManager'
import Icon from 'react-native-vector-icons/FontAwesome'


export default function TeacherSchedules({ route, navigation }) {

    const localNavigation = useNavigation()
    const [selectedView, setSelectedView] = useState('events')
    const [session, setSession] = useState(null)
    const [schedules, setSchedules] = useState({count: 0, services: [], data: []})
    const [schedule, setSchedule] = useState(null)
    const [scheduleValues, setScheduleValues] = useState({})
    const [date, setDate] = useState(null)
    const [schedulesNotification, setSchedulesNotification] = useState(false)
    const [haveEvents, setHaveEvents] = useState(false)


    useEffect(() => {
        GetSession().then(response => {
            const data = JSON.parse(response)
            setSession(data)
            loadSchedules(data.token)
        }).catch((error) => console.log(error))
    }, [])

    useEffect(() => {
        if(schedules != null){
            const notifications = schedules.data.filter(item => item.professional == null && !item.status).length == 0
            const events = schedules.data.filter(item => item.professional == session.user.id).length > 0
            setSchedulesNotification(notifications)
            setHaveEvents(events)
        }
    }, [schedules])

    useEffect(() => {
        if(route.params?.forceUpdate){ loadSchedules() }
    }, [route.params?.forceUpdate])

    const loadSchedules = async (token) => {
        const token_key = token === undefined ? session.token : token
        fetch(`${HOST}/api/user/${token_key}/schedules/`).then((response) => response.text()).then( (json) => {
            const data = JSON.parse(json)
            setSchedules(data)
            setSchedule(null)
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

    const confirmRequest = async () => {
        Alert.alert('Agendamento de serviço.', 'A operação só pode ser desfeita por contato direto com a administração, tem certeza de que deseja continuar?', [{text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel',},
            {text: 'Sim', onPress: () => {
                fetch(`${HOST}/api/user/${session.token}/schedule/change/${scheduleValues.id}/`, 
                    {
                        method: 'POST', 
                        headers: { Accept: 'application/json', 'Content-Type': 'application/json' 
                    }, body: JSON.stringify({professional: session.user.id, status: false})
                }).then((response) => response.text()).then((json) => {
                            Alert.alert('Agendamento de serviço.', 'A operação foi concluída com sucesso.', [{text: 'OK'},], {cancelable: false}, )
                            setScheduleValues({})
                            setSelectedView('events')
                            loadSchedules()
                }).catch((error) => {
                    Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
                    console.log('this: ', error.message)
                })
            }},
        ])
    }
    

    return(
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={styles.headerCard}>
                <View style={{marginBottom: -20}}>
                    <Text style={localstyles.headerCardTitle}>SERVIÇOS</Text>
                    <Text style={localstyles.headerCardSubTitle}>Agendamentos e avaliações</Text>
                </View>
            </Animatable.View>

            <Animatable.View>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '90%', marginHorizontal: '5%', marginTop: 20}}>
                    <TouchableOpacity style={{alignItems: 'center'}} disabled={!haveEvents} onPress={() => setSelectedView('events')}>
                        <Icon name={'check'} size={20} color={!haveEvents ? '#ccc' : primaryColor} />
                        <Text style={{fontWeight: 'bold', color: !haveEvents ? '#ccc' : primaryColor}}>Meus eventos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: 'center'}} disabled={schedulesNotification} onPress={() => setSelectedView('schedule')}>
                        <Icon name={'comments-o'} size={20} color={schedulesNotification ? '#ccc' : primaryColor} />
                        <Text style={{fontWeight: 'bold', color: schedulesNotification ? '#ccc' : primaryColor}}>Solicitações</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => loadSchedules()}>
                        <Icon name={'refresh'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Atualizar</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>

            {selectedView === 'events' &&
                <View style={{marginTop: 20, width: '90%', marginHorizontal: '5%'}}>
                    {schedules != null &&
                        <ScrollView horizontal={true} style={{width: '100%', height: '15%'}}>
                            {
                                schedules.data.filter(item => item.professional == session.user.id).map((item, index) => 
                                    <View key={item.id} style={localstyles.scrollViewCard}>
                                        <Text style={localstyles.scrollCardTitle}>{item.service_name}</Text>
                                        <Text>{shortDateFormat(item.date)}</Text>
                                        <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'space-between'}}>
                                            <TouchableOpacity style={localstyles.scrollCardButton} onPress={() => setSchedule(item)}>
                                                <Text style={localstyles.scrollCardButtonText}>VER</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }
                        </ScrollView>
                    }
                    {schedule != null &&

                        <View style={{width: '100%', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: '#fff', borderRadius: 5, marginTop: 20}}>
                            <Text>Aluno: {schedule.student_name}</Text>
                            {schedule.professional != null &&
                                <Text style={{marginTop: 10}}>Profissional: {schedule.professional_name}</Text>
                            }
                            <Text style={{marginTop: 10}}>{schedule.service_name}, ás {schedule.hour.slice(0, -3)}</Text>
                            <Text style={{marginTop: 10}}>Agendado em {shortDateFormat(schedule.created)}</Text>

                            { (schedule.professional != null && !schedule.status) && <Text style={localstyles.confirmedButton}>Confirmado</Text> }
                            { (schedule.professional != null && schedule.status) && <Text style={localstyles.finalizedButton}>Finalizado</Text> }
                        </View>
                    }
                    <TouchableOpacity style={{marginTop: 50, padding: 10, backgroundColor: primaryColor, borderRadius: 5, alignItems: 'center'}} onPress={() => localNavigation.navigate('TeacherDash')}>
                        <Text style={{color: '#fff'}}>INÍCIO</Text>
                    </TouchableOpacity>
                </View>
            }

            {(selectedView === 'schedule' && schedules != null) &&
                <View style={{width: '90%', marginHorizontal: '5%', padding: 20, backgroundColor: '#fff', borderRadius: 5, marginTop: 20}}>
                    <ScrollView style={{width: '100%', height: 210}}>
                        {schedules.data.filter(item => item.professional == null && !item.status).map((item) =>
                            <TouchableOpacity key={item.id} style={{borderLeftWidth: 2, borderLeftColor: primaryColor, marginVertical: 10, paddingLeft: 4, borderBottomColor: '#ccc', borderBottomWidth: 0.5}} onPress={() => setScheduleValues(item)}>
                                <Text style={{color: primaryColor, textTransform: 'uppercase'}}>{item.townhouse}</Text>
                                <Text>{item.service_name}, às {item.hour} de {shortDateFormat(item.date)}</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>
            }
            {(Object.keys(scheduleValues).length > 0 && selectedView == 'schedule') &&
                <View style={{width: '90%', marginHorizontal: '5%', padding: 20, backgroundColor: '#fff', borderRadius: 5, marginTop: 20}}>
                    <Text style={{fontWeight: 'bold', color: primaryColor, marginBottom: 10}}>CONFIRMAÇÃO DE AGENDAMENTO</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: '70%'}}>
                            <Text>Especialidade: {scheduleValues.service_name}</Text>
                            <Text>Data: {shortDateFormat(scheduleValues.date)}</Text>
                            <Text>Hora: {scheduleValues.hour}</Text>
                        </View>
                        <View style={{width: '30%'}}>
                            <TouchableOpacity style={[localstyles.confirmationButton, localstyles.marginTop]} onPress={() => confirmRequest()}>
                                <Icon name={'check'} size={20} color={'#fff'} />
                                <Text style={{textTransform: 'uppercase', color: '#fff', fontSize: 10, marginTop: 5}}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
        </View>
    )
}

const localstyles = StyleSheet.create({
    confirmationButton: {
        backgroundColor: primaryColor,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        height: 60,
        justifyContent: 'center'
    },
    waitingButton: {
        width: '100%',
        padding: 10,
        color: '#fff',
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: '#f1c40f',
        textAlign: 'center'
    },
    confirmedButton: {
        width: '100%',
        padding: 10,
        color: '#fff',
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: primaryColor,
        textAlign: 'center'
    },
    finalizedButton: {
        width: '100%',
        padding: 10,
        color: '#fff',
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: '#3498db',
        textAlign: 'center'
    },
    scrollViewCard: {
        width: 200,
        backgroundColor: '#fff',
        height: '100%',
        borderRadius: 10,
        padding: 20,
        marginRight: 15,
        justifyContent: 'center'
    },
    marginTop: { marginTop: 10},
    scrollCardButton: {
        paddingHorizontal: 40,
        paddingVertical: 10,
        backgroundColor: primaryColor,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center'
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
    isInactive: {backgroundColor: '#ccc'},
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
        fontSize: 36,
        textTransform: 'uppercase'
    },
    headerCardSubTitle: {
        color: '#fff',
        fontSize: 16,
        textTransform: 'uppercase'
    },
})