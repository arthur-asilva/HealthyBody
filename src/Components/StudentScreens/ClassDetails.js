import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
import { useNavigation } from "@react-navigation/native"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { HOST } from "../../DataKeys"
import { HOST } from '../../DataKeys'
import Icon from 'react-native-vector-icons/FontAwesome'


export default function ClassDetails({ route, navigation }) {

    const [classDetails, setClassDetails] = useState(route.params.classDetails)
    const [classStatus, setClassStatus] = useState(route.params.status)
    const [session, setSession] = useState(route.params.session)
    const [lessons, setLessons] = useState({})
    const [image, setImage] = useState(null)
    const localNav = useNavigation()

    useEffect(() => {}, [])

    useEffect(() => {
        if(route.params?.session){
            setSession(route.params.session)
        }
    }, [route.params?.session])

    useEffect(() => {
        if(route.params?.classDetails || route.params?.forceUpdate){
            setClassDetails(route.params.classDetails)
            fetch(`${HOST}/api/user/${session.token}/class/${classDetails.enrollment_class__id}/attendance_list/`).then((response) => response.text()).then((json) => {
                setLessons(JSON.parse(json).lessons)
            }).catch((error) => {
                Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
                console.log('this: ', error)
            })
        }
    }, [route.params?.classDetails, route.params?.forceUpdate])

    useEffect(() => {
        if(route.params?.status){
            setClassStatus(route.params.status)
        }
    }, [route.params?.status])

    const intToWeekday = (value) => {
        const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
        let result = ''
        for(let i=0; i<value.length; i++){
            result += days[value[i]]
            if(i < value.length - 1){ result += ', ' }
        }
        return result + '.'
    }

    const shortDateFormat = (value) => {
        const data = new Date(value)
        const day = data.getDate() < 10 ? '0' + data.getDate() : data.getDate()
        const month = (data.getMonth() + 1) < 10 ? '0' + (data.getMonth() + 1) : (data.getMonth() + 1)
        const year = data.getFullYear()
        return `${day}/${month}/${year}`
    }

    const selectClass = (value) => {
        setImage(value.photo)
    }

    const likeLesson = (value) => {
        fetch(`${HOST}/api/user/${session.token}/attendance_like/${value}/`).then((response) => response.text()).then((json) => {
            navigation.navigate('ClassDetails', {classDetails: classDetails, session: session, status: true, forceUpdate: new Date().getTime()})
        }).catch((error) => {
            Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
            console.log('this: ', error)
        })
    }

    const subscribeControl = async (id) => {
        Alert.alert('Gerenciamento de matrícula', 'Tem certeza de que deseja continuar?', [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel', },
            {text: 'OK', onPress: () => {
                fetch(`${HOST}/api/user/${session.token}/subscribe/${id}`).then( (json) => {
                    Alert.alert('Controle de matrícula.', 'Operação realizada com sucesso.', [{text: 'OK'},], {cancelable: false}, )
                    if(route.params.status){
                        localNav.navigate('UnsubscribeComment', {'classDetails': route.params.classDetails, 'session': session })
                    } else {
                        localNav.navigate('StudentDash', {forceUpdate: new Date().getTime()})
                    }
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
                <View style={{flexDirection: 'row', marginBottom: -20, alignItems: 'center'}}>
                    <View style={{width: '100%'}}>
                        <Text style={localstyles.headerCardTitle}>{classDetails.enrollment_class__service}</Text>
                        <Text style={localstyles.headerCardSubTitle}>Início às {classDetails.enrollment_class__schedule}</Text>
                        <Text style={localstyles.headerCardSubTitle}>Dias: {intToWeekday(classDetails.enrollment_class__weekday.days)}</Text>
                    </View>
                </View>
            </Animatable.View>

            <View style={{height: 150}}>

                {lessons.length > 0 &&
                    <ScrollView horizontal={true} style={{width: '90%', marginHorizontal: '5%', marginTop: 20, paddingBottom: 10}}>
                        {
                            lessons.map((item, index) => 
                                <View key={item.id} style={localstyles.scrollViewCard}>
                                    <Text style={localstyles.scrollCardTitle}>{shortDateFormat(item.date)}</Text>
                                    <Text style={localstyles.scrollCardTitle}>{item.details}</Text>
                                    {item.enrollments.filter(enroll => enroll.id == session.user.id).length > 0 &&
                                        <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'space-between'}}>
                                            <TouchableOpacity style={localstyles.scrollCardLike} onPress={() => likeLesson(item.id)}>
                                                <Icon name={item.likes.users.includes(session.user.id) ? 'heart' : 'heart-o'} size={20} color={item.likes.users.includes(session.user.id) ? '#f00' : primaryColor} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={localstyles.scrollCardButton} onPress={() => selectClass(item)}>
                                                <Text style={localstyles.scrollCardButtonText}>VER</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    {!item.enrollments.filter(enroll => enroll.id == session.user.id).length > 0 &&
                                        <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'space-between'}}>
                                            <TouchableOpacity disabled={true} style={localstyles.scrollCardLike}>
                                                <Icon name='heart-o' size={20} color={'#ccc'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity disabled={true} style={[localstyles.scrollCardButton, localstyles.scrollCardButtonInactive]}>
                                                <Text style={localstyles.scrollCardButtonText}>VER</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                            )
                        }
                    </ScrollView>
                }
            </View>

            {classStatus &&
                <View>
                    <Text style={{color: primaryColor, marginLeft: '5%', marginVertical: 10, fontSize: 20}}>Foto da aula</Text>
                    <View style={{width: '90%', marginHorizontal: '5%', height: 200, backgroundColor: '#ccc'}}>
                        {image !== null &&  <Image resizeMode={'stretch'} style={{width: '100%', height: '100%'}} source={{uri: image}} />}
                    </View>
                </View>
            }

            {!classStatus &&
                <TouchableOpacity style={[localstyles.button, localstyles.isActive]} onPress={() => subscribeControl(classDetails.enrollment_class__id)}>
                    <Text style={{textTransform: 'uppercase', color: '#fff', letterSpacing: 2, fontSize: 16}}>Quero participar desta turma</Text>
                </TouchableOpacity>
            }

            {classStatus &&
                <TouchableOpacity style={[localstyles.button]} onPress={() => subscribeControl(classDetails.enrollment_class__id)}>
                    <Icon name='close' size={20} color={'#ee5253'} style={{marginRight: 10}}/>
                    <Text style={localstyles.isInactive}>Sair da turma</Text>
                </TouchableOpacity>
            }

        </View>
    )
}

const localstyles = StyleSheet.create({
    scrollCardLike: {
        width: '40%',
        padding: 10,
        alignItems: 'center'
    },
    scrollCardButton: {
        width: '40%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: primaryColor,
        alignItems: 'center'
    },
    scrollCardButtonInactive: { backgroundColor: '#ccc' },
    scrollCardButtonText: { color: '#fff' },
    scrollViewCard: {
        width: 250,
        backgroundColor: '#fff',
        height: '100%',
        borderRadius: 10,
        padding: 20,
        marginRight: 15,
        justifyContent: 'center'
    },
    button: {
        width: '90%',
        marginHorizontal: '5%',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
        justifyContent: 'center'
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
    isActive: {
        backgroundColor: primaryColor
    },
    isInactive: {
        color: '#fff',
        letterSpacing: 2,
        fontSize: 16,
        color: '#ee5253'
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
        fontSize: 24,
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