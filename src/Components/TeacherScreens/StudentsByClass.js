import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import { HOST } from "../../DataKeys"
import DateTimePicker from '@react-native-community/datetimepicker'
import BottomTabs from '../BottomTabs'




export default function StudentsByClass({ route, navigation }) {

    const localNav = useNavigation()
    const current_class = route.params.id
    const initialDate = new Date()
    const [students, setStudents] = useState([])
    const [classData, setClassData] = useState({town: '', schedule: ''})

    const [date, setDate] = useState(initialDate)
    const [displayDate, setDisplayDate] = useState(`${initialDate.getDate()}/${initialDate.getMonth()}/${initialDate.getFullYear()}`)
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [attendance, setAttendance] = useState([])





    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate
        setShow(false);
        setDisplayDate(`${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`)
        setDate(selectedDate);
      }
    
      const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
          setShow(false);
          // for iOS, add a button that closes the picker
        }
        setMode(currentMode);
      }






    
    const getSession = async () => {
        let result = await AsyncStorage.getItem('session')
        return result
    }

    const getData = async (token, id) => {

        fetch(`${HOST}/api/user/${token}/class/${id}/students/`).then(response => response.json())
                .then( (json) => {
                    if(Object.keys(json).length > 0){
                        setStudents(json)
                        setClassData({town: json[0].class_name, schedule: json[0].class_schedule})
                    }
                    else{
                        setClassData({town: 'Não há alunos nessa turma', schedule: ''})
                        setStudents([])
                    }
                })
                .catch((error) => {
                    Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
                    console.log(error)
                })
    }

    useEffect(() => {
        getSession().then(response => {getData(JSON.parse(response).token, route.params.id)})
    }, [])

    useEffect(() => {
        if(route.params?.id){
            getSession().then(response => {getData(JSON.parse(response).token, route.params.id)})
        }
    }, [route.params?.id])

    const addToAttendance = (value) => {
        const ifExists = attendance.filter(user => user.id == value.id)
        if(ifExists.length == 0){
            setAttendance([...attendance, value])
        }
    }

    const removeFromAttendance = (value) => {
        let newList = attendance.filter(user => user.id != value.id)
        setAttendance(newList)
    }

    return (
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={styles.headerCard}>
                <Text style={styles.headerCardTitle}>{classData.town}</Text>
            </Animatable.View>

            {
                Object.keys(students).length > 0 &&
                    <>
                        <Text style={localstyles.serviceHeader}>Frequência</Text>

                        <View style={localstyles.datePickerControl}>
                            <Text style={{fontSize: 16}}>Dia da aula: {displayDate}</Text>
                            <TouchableOpacity style={localstyles.datePickerControlButton} onPress={() => setShow('date')}>
                                <Icon name="calendar" size={25} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {show && (
                            <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                            />
                        )}

                        <View style={{marginLeft: 10, height: 290}}>
                            <ScrollView style={{position: 'absolute'}} horizontal={true}>

                                <View style={localstyles.todayClasses}>
                                    <Text style={localstyles.todayClassesHeader}>Todos os alunos</Text>
                                    <ScrollView style={{marginTop: 20}}>

                                        {
                                            students.map((item) => 
                                                <View key={item.id} style={localstyles.studentItem}>
                                                    <Text>{item.student_name}</Text>
                                                    <View style={localstyles.itemButtonsContainer}>
                                                        <TouchableOpacity style={localstyles.itemButtons} onPress={() => addToAttendance({id: item.id, name: item.student_name})}>
                                                            <Icon name="check" size={20} color='#fff' />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={localstyles.itemButtons} onPress={() => localNav.navigate('StudentsProfile', {id: item.id} )}>
                                                            <Icon name="bars" size={20} color='#fff' />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        }

                                    </ScrollView>
                                </View>

                                <View style={localstyles.todayClasses}>
                                    <Text style={localstyles.todayClassesHeader}>Presentes</Text>
                                    <ScrollView style={{marginTop: 20}}>

                                        {
                                            attendance.map((item) => 
                                                <View key={item.id} style={localstyles.studentItem}>
                                                    <Text>{item.name}</Text>
                                                    <TouchableOpacity style={localstyles.itemButtonClose} onPress={() => removeFromAttendance({id: item.id, name: item.name})}>
                                                        <Icon name="close" size={20} color='#fff' />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }

                                    </ScrollView>
                                </View>

                            </ScrollView>
                        </View>

                        <View style={localstyles.attendanceButtonsContainer}>
                            {/* <TouchableOpacity onPress={() => localNav.navigate('TeacherDash')}>
                                <Text style={localstyles.attendanceButtons}>Voltar</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity disabled={attendance.length == 0}>
                                <Text style={[localstyles.attendanceButtons, attendance.length == 0 && localstyles.disabledButton]}>Salvar lista de presença</Text>
                            </TouchableOpacity>
                        </View>

                    </>
            }

            {
                Object.keys(students).length == 0 &&
                <TouchableOpacity style={localstyles.returnButton} onPress={() => localNav.navigate('TeacherDash')}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>VOLTAR</Text>
                </TouchableOpacity>
            }

            
            <BottomTabs />
        </View>
    );
}



const localstyles = StyleSheet.create({
    attendanceButtons: {
        color: '#fff',
        textTransform: 'uppercase',
        backgroundColor: primaryColor,
        padding: 10,
        borderRadius: 3,
        fontWeight: 'bold'
    },
    disabledButton: {
        backgroundColor: '#ccc'
    },
    attendanceButtonsContainer: {
        width: '90%',
        marginHorizontal: '5%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    },
    datePickerControl: {
        width: '90%',
        marginHorizontal: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    datePickerControlButton: {
        backgroundColor: primaryColor,
        padding: 10,
        borderRadius: 3
    },
    returnButton: {
        width: '90%',
        backgroundColor: primaryColor,
        marginHorizontal: '5%',
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
        borderRadius: 9
    },
    itemButtons: {
        backgroundColor: primaryColor,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 3
    },
    itemButtonClose: {
        backgroundColor: '#ee5253',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 3
    },
    itemButtonsContainer: {
        width: 90,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    studentItem: {
        flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderTopColor: primaryColor,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    serviceHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: primaryColor,
        marginLeft: 20,
        marginTop: 20,
        textTransform: 'uppercase'
    },
    todayClasses: {
        backgroundColor: '#fff',
        padding: 20,
        height: 250,
        width: 300,
        marginTop: 20,
        marginHorizontal: 10,
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