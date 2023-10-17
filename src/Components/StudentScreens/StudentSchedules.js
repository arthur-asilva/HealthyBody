import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from "@react-navigation/native"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { HOST } from "../../DataKeys"
import { HOST } from '../../DataKeys'
import Icon from 'react-native-vector-icons/FontAwesome'


export default function StudentSchedule({ route, navigation }) {

    const localNavigation = useNavigation()
    const [selectedView, setSelectedView] = useState('events')
    const [session, setSession] = useState(route.params.session)
    const [schedules, setSchedules] = useState({count: 0, services: []})
    const [schedule, setSchedule] = useState(null)
    const [modal, setModal] = useState(false)
    const [date, setDate] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [scheduleValues, setScheduleValues] = useState({})
    const [professional, setProfessional] = useState(null)
    const [service, setService] = useState(null)
    const [selectData, setSelectData] = useState([])


    const onChangeDate = (event, selectedDate) => {
        setShow(false);

        if (event?.type === 'dismissed') {
            return;
        } 
        if(selectedDate !== undefined){
            setDate(selectedDate)
            const selected_date = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`
            const selected_hour = `${selectedDate.getHours()}:${selectedDate.getMinutes()}`
            setScheduleValues({'date': selectedDate, 'hour': selected_hour, 'student': session.user.id, 'service': service.id})
        }
    }

    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(false);
            // for iOS, add a button that closes the picker
        }
        setMode(currentMode)
    }

    const loadModal = (value) => {
        if(value == 'service'){
            setSelectData(schedules.services)
        }
        setModal(!modal)
    }

    useEffect(() => {loadSchedules()}, [])

    useEffect(() => { setModal(false) }, [service])

    useEffect(() => {
        if(route.params?.session){  setSession(route.params.session)}
    }, [route.params?.session])

    useEffect(() => {
        if(route.params?.forceUpdate){ loadSchedules() }
    }, [route.params?.forceUpdate])

    const loadSchedules = async () => {
        fetch(`${HOST}/api/user/${session.token}/schedules/`).then((response) => response.text()).then( (json) => {
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

    const scheduleConfirmation = async () => {

        const day = scheduleValues.date.getDate() < 10 ? '0' + scheduleValues.date.getDate() : scheduleValues.date.getDate()
        const month = (scheduleValues.date.getMonth() + 1) < 10 ? '0' + (scheduleValues.date.getMonth() + 1) : (scheduleValues.date.getMonth() + 1)
        const year = scheduleValues.date.getFullYear()
        const hour = `${scheduleValues.date.getHours() < 10 ? '0' + scheduleValues.date.getHours() : scheduleValues.date.getHours()}:${scheduleValues.date.getMinutes() < 10 ? '0' + scheduleValues.date.getMinutes() : scheduleValues.date.getMinutes()}`

        fetch(`${HOST}/api/user/${session.token}/schedule/`, 
            {   method: 'POST', 
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, 
                body: JSON.stringify({
                    "student": session.user.id,
                    "service": service.id,
                    "date": `${year}-${month}-${day}`,
                    "hour": hour
                })
        }).then((response) => response.text()).then((json) => {
                    Alert.alert('Agendamento de serviço.', 'A operação foi concluída com sucesso.', [{text: 'OK'},], {cancelable: false}, )
                    setScheduleValues({})
                    setSelectedView('events')
                    loadSchedules()
        }).catch((error) => {
            Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
            console.log('this: ', error.message)
        })
    }

    const scheduleConfirmationMessage = () => {
        Alert.alert('Agendamento de serviço.', 'A operação só pode ser desfeita por contato direto com o profissional, tem certeza de que deseja continuar?', [{text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel',},
            {text: 'Sim', onPress: () => scheduleConfirmation()},
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
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setSelectedView('events')}>
                        <Icon name={'check'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Meus eventos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setSelectedView('schedule')}>
                        <Icon name={'calendar'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Agendamento</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => loadSchedules()}>
                        <Icon name={'refresh'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Atualizar</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>

            {selectedView === 'events' &&
                <View style={{marginTop: 20, width: '90%', marginHorizontal: '5%'}}>
                    {schedules.count > 0 &&
                        <ScrollView horizontal={true} style={{width: '100%', height: '15%'}}>
                            {
                                schedules.data.filter(item => item.student_id == session.user.id).map((item, index) => 
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
                    {schedule !== null &&

                        <View style={{width: '100%', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: '#fff', borderRadius: 5, marginTop: 20}}>
                            <Text>Aluno: {schedule.student_name}</Text>
                            {schedule.professional != null &&
                                <Text style={{marginTop: 10}}>Profissional: {schedule.professional_name}</Text>
                            }
                            <Text style={{marginTop: 10}}>{schedule.service_name}, ás {schedule.hour.slice(0, -3)}</Text>
                            <Text style={{marginTop: 10}}>Agendado em {shortDateFormat(schedule.created)}</Text>

                            { schedule.professional == null && <Text style={localstyles.waitingButton}>Aguardando</Text> }
                            { (schedule.professional != null && !schedule.status) && <Text style={localstyles.confirmedButton}>Confirmado</Text> }
                            { (schedule.professional != null && schedule.status) && <Text style={localstyles.finalizedButton}>Finalizado</Text> }
                        </View>
                    }
                </View>
            }

            {selectedView === 'schedule' &&
                <View style={{width: '90%', marginHorizontal: '5%', padding: 20, backgroundColor: '#fff', borderRadius: 5, marginTop: 20}}>

                    <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={{fontSize: 16}}>{service != null && `${service.name}`}{service == null && 'Especialidades'}</Text>
                        <TouchableOpacity onPress={() => loadModal('service')} style={{marginLeft: 20, backgroundColor: primaryColor, width: 30, height: 30, borderRadius: 5, justifyContent: 'center', alignItems: 'center'}}>
                            <Icon name={'chevron-down'} size={20} color={'#fff'} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[localstyles.scrollCardButton, localstyles.marginTop, service == null && localstyles.isInactive]} disabled={service == null ? true : false} onPress={() => {setShow(true); setMode('date')}}>
                        <Text style={{textTransform: 'uppercase', color: '#fff', fontWeight: 'bold'}}>Escolher data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[localstyles.scrollCardButton, localstyles.marginTop, service == null && localstyles.isInactive]} disabled={service == null ? true : false} onPress={() => {setShow(true); setMode('time')}}>
                        <Text style={{textTransform: 'uppercase', color: '#fff', fontWeight: 'bold'}}>Escolher hora</Text>
                    </TouchableOpacity>

                    <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
                        <Text style={{fontSize: 16}}>{professional != null && `nome escolhido`}{professional == null && 'Profissional'}</Text>
                        <TouchableOpacity style={{marginLeft: 20, backgroundColor: primaryColor, width: 30, height: 30, borderRadius: 5, justifyContent: 'center', alignItems: 'center'}}>
                            <Icon name={'chevron-down'} size={20} color={'#fff'} />
                        </TouchableOpacity>
                    </View>

                    {show && (
                        <DateTimePicker testID="dateTimePicker" value={date} mode={mode} is24Hour={true} onChange={onChangeDate} />
                    )}
                </View>
            }
            {Object.keys(scheduleValues).length == 4 &&
                <View style={{width: '90%', marginHorizontal: '5%', padding: 20, backgroundColor: '#fff', borderRadius: 5, marginTop: 20}}>
                    <Text style={{fontWeight: 'bold', color: primaryColor, marginBottom: 10}}>CONFIRMAÇÃO DE AGENDAMENTO</Text>
                    <Text>Especialidade: {service.name}</Text>
                    <Text>Data: {shortDateFormat(date)}</Text>
                    <Text>Hora: {`${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`}</Text>
                    <TouchableOpacity style={[localstyles.scrollCardButton, localstyles.marginTop]} onPress={() => scheduleConfirmationMessage()}>
                        <Text style={{textTransform: 'uppercase', color: '#fff', fontWeight: 'bold'}}>Agendar</Text>
                    </TouchableOpacity>
                </View>
            }
            <View style={[localstyles.modal, modal && localstyles.isVisible]}>
                <View style={{width: '90%', marginHorizontal: '5%', padding: 20, backgroundColor: '#fff', borderRadius: 5, marginTop: 20}}>
                    <View style={{width: '100%', height: 300}}>
                        <Text style={{fontSize: 16, color: primaryColor, fontWeight: 'bold', paddingBottom: 10}}>Escolha a especialidade</Text>
                        <ScrollView style={{marginBottom: 10}}>
                            {selectData.length > 0 &&
                                selectData.map((item) =>
                                    
                                    <TouchableOpacity style={localstyles.serviceOption} key={item.id} onPress={() => setService(item)}>
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </ScrollView>
                    </View>
                    <TouchableOpacity style={{width: '100%', alignItems: 'center'}} onPress={() => setModal(false)}>
                        <Text style={{color: '#3498db'}}>CANCELAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const localstyles = StyleSheet.create({
    serviceOption: {
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderColor: '#ccc'
    },
    modal: {
        display: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
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