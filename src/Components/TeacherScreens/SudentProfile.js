import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, Keyboard, ScrollView, TextInput, TouchableOpacity, Image } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
// import { useNavigation } from "@react-navigation/native"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { HOST } from "../../DataKeys"
import BottomTabs from '../BottomTabs'
import { HOST } from '../../DataKeys'
import { GetSession } from '../../SessionManager'
import Icon from 'react-native-vector-icons/FontAwesome'


export default function StudentsProfile({ route, navigation }) {

    const [student, setStudent] = useState({id: '', name: '', email: '', access_group: '', is_active: '', photo: null, created_at: '', height: '', mass: '', workout_tips: [], born_date: '', last_access: '', score: ''})
    // const [student, setStudent] = useState()
    const [visibleCard, setVisibleCard] = useState('IMC')
    const [session, setSession] = useState({token: ''})
    const [imcLevel, setImcLevel] = useState(null)
    
    const [mass, setMass] = useState(0)
    const [height, setHeight] = useState(0)
    const [workout_tips, setWork_tips] = useState([])
    const [workout, setWorkout] = useState({id: 0, name: "", type: "", serie: 0, repetitions: 0, rest: 0, details: ""})



    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [serie, setSerie] = useState("")
    const [rep, setRep] = useState("")
    const [rest, setRest] = useState("")
    const [details, setDetails] = useState("")

    const [keyStatus, keySetStatus] = useState(false)


    const [filteredWorkout, setFilteredWorkout] = useState("A")


    const keyboardShowListener = Keyboard.addListener( 'keyboardDidShow', () => { keySetStatus(true) } )
    const keyboardHideListener = Keyboard.addListener( 'keyboardDidHide', () => { keySetStatus(false) } )

    useEffect(() => {
        GetSession().then(response => {
            const data = JSON.parse(response)
            setSession(data)
            fetch(`${HOST}/api/user/${data.token}/student/${route.params.id}/`).then(resposta => resposta.text()).then( (json) => {
                const studentData = JSON.parse(json)
                setStudent(studentData)
                setHeight(studentData.height)
                setMass(studentData.mass)
                
                if(Array.isArray(studentData.workout_tips)){
                    setWork_tips(studentData.workout_tips)
                } else {
                    if(Object.keys(studentData.workout_tips).length !== 0){
                        setWork_tips(studentData.workout_tips.workout_tips)
                    }
                }

                if(mass != undefined && height != undefined){
                    setImcLevel(studentData.mass / (studentData.height * studentData.height))
                }

            }).catch((error) => {
                Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
                console.log('1. #########################')
                console.log('this: ', error.message)
            })
        }).catch((error) => console.log(error))
    }, [])

    const updateMassAndHeight = async () => {
        fetch(`${HOST}/api/user/${session.token}/student/${route.params.id}/update/`, { method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({height: height, mass: mass})
        }).then(resposta => resposta.json()).then( () => {
            Alert.alert('Operação concluída.', 'Os dados foram salvos com sucesso.', [{text: 'OK'},], {cancelable: false}, )
        }).catch((error) => {
            Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
        })
        if(height != undefined && mass != undefined){
            setImcLevel(Number(mass) / (Number(height) * Number(height)))
        }
    }

    const updateWorktips = async() => {
        fetch(`${HOST}/api/user/${session.token}/student/${route.params.id}/update/`, { method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            // body: JSON.stringify({workout_tips: {}})
            body: addWorkout()
        }).then(resposta => resposta.json()).then( () => {
            Alert.alert('Operação concluída.', 'Os dados foram salvos com sucesso.', [{text: 'OK'},], {cancelable: false}, )
        }).catch((error) => {
            Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
            console.log(error)
        })
    }

    const addWorkout = () => {

        let workouts = {workout_tips: workout_tips}

        // if(Object.keys(workout_tips).length === 0){
        //     workouts = {workout_tips: []}
        // }
        console.log(workouts)
        let current_workout = { 
                        id: workouts.workout_tips.length,
                        name: name, 
                        type: type, 
                        serie: serie, 
                        repetitions: rep, 
                        details: details,
                        rest: rest
                    }
        workouts.workout_tips.push(current_workout)
        setWork_tips(workouts.workout_tips)
        return JSON.stringify(workouts)
    }

    const setWorkoutByKey = (key, value) => {

        let newState = workout

        if(key === 'type'){
            const types = ['A', 'B', 'C', 'D', 'E']
            if(types.includes(value.toUpperCase())){
                newState[key] = value.toUpperCase()
                setWorkout(newState)
            }
        } else {
            newState[key] = value
            setWorkout(newState)
        }
    }

    const deleteWorkout = (index) => {
        Alert.alert('Excluir exercício.', 'Os dados não poderão ser recuperados.', [{text: 'Cancelar', style: 'cancel',},
            {text: 'OK', onPress: () => {
                let new_list = [...workout_tips]
                new_list.splice(index, 1)
                fetch(`${HOST}/api/user/${session.token}/student/${route.params.id}/update/`, { method: 'POST',
                    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({workout_tips: new_list})
                }).then( () => {
                    setWork_tips(new_list)
                    Alert.alert('Operação concluída.', 'Os dados foram salvos com sucesso.', [{text: 'OK'},], {cancelable: false}, )
                }).catch((error) => {
                    Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
                    console.log(error)
                })
            }},
        ])
    }

    useEffect(() => {
        if(route.params?.id){
            GetSession().then(response => {
                const data = JSON.parse(response)
                setSession(data)
                fetch(`${HOST}/api/user/${data.token}/student/${route.params.id}/`).then(resposta => resposta.text()).then( (json) => {
                    const studentData = JSON.parse(json)
                    setStudent(studentData)
                    setHeight(studentData.height)
                    setMass(studentData.mass)
                    
                    // if(Object.keys(studentData.workout_tips).length !== 0){
                    //     setWork_tips(studentData.workout_tips.workout_tips)
                    // }

                }).catch((error) => {
                    Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
                    console.log('2. #########################')
                    console.log('this: ', error.message)
                })
            }).catch((error) => console.log(error))
        }
    }, [route.params?.id])

    return (
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={styles.headerCard}>
                <View style={{flexDirection: 'row', marginBottom: -20, alignItems: 'center'}}>
                    { student.photo === '...' && 
                        <Image style={localstyles.image} source={require('../../../assets/images/default_user_icon.png')} />
                    }

                    { student.photo !== '...' && 
                        <Image style={localstyles.image} source={{uri: student.photo}} />
                    }
                    <View>
                        <Text style={localstyles.headerCardTitle}>{student.name}</Text>
                        <Text style={localstyles.headerCardSubTitle}>{student.email.split('@')[0]}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '60%'}}>
                            <Text style={localstyles.headerCardSubTitle}>Score: {student.score}</Text>
                            <Text style={localstyles.headerCardSubTitle}>Progresso: {student.progress}%</Text>
                        </View>
                    </View>
                </View>
            </Animatable.View>

            <Animatable.View>
                <Text style={localstyles.title}>Controle do aluno</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginHorizontal: '5%', marginVertical: 10}}>
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setVisibleCard('IMC')}>
                        <Icon name={'user'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>IMC</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setVisibleCard('Exercices')}>
                        <Icon name={'trophy'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Exercícios</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setVisibleCard('Report')}>
                        <Icon name={'folder-open'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Ficha</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>

            <View style={[localstyles.card, visibleCard == 'IMC' && localstyles.isVisible]}>
                <ScrollView automaticallyAdjustKeyboardInsets={true}>
                    <Text style={{fontSize: 16}}>Altura</Text>
                    <TextInput keyboardType='numeric' style={localstyles.textInput} onChangeText={value => setHeight(value.replace(',', '.'))} value={height} />

                    <Text style={{fontSize: 16, marginTop: 20}}>Peso</Text>
                    <TextInput keyboardType='numeric' style={localstyles.textInput} onChangeText={value => setMass(value.replace(',', '.'))} value={mass} />
                </ScrollView>

                <TouchableOpacity onPress={updateMassAndHeight} style={{backgroundColor: primaryColor, padding: 10, borderRadius: 3, justifyContent: 'center', marginTop: 20, alignItems: 'center'}}>
                    <Text style={{textTransform: 'uppercase', color: '#fff', fontWeight: 'bold'}}>Atualizar</Text>
                </TouchableOpacity>

                { imcLevel <= 18.5 && 
                    <Image style={{width: 150, height: 90, marginBottom: -10, marginTop: 10, alignSelf: 'center', resizeMode: 'stretch',}} source={require('../../../assets/images/imc_icons/1.png')} />}
                { (imcLevel > 18.5 && imcLevel <= 24.9) &&
                    <Image style={{width: 150, height: 90, marginBottom: -10, marginTop: 10, alignSelf: 'center', resizeMode: 'stretch',}} source={require('../../../assets/images/imc_icons/2.png')} />}
                { (imcLevel > 24.9 && imcLevel <= 29.9) &&
                    <Image style={{width: 150, height: 90, marginBottom: -10, marginTop: 10, alignSelf: 'center', resizeMode: 'stretch',}} source={require('../../../assets/images/imc_icons/3.png')} />}
                { (imcLevel > 29.9 && imcLevel <= 34.9) &&
                    <Image style={{width: 150, height: 90, marginBottom: -10, marginTop: 10, alignSelf: 'center', resizeMode: 'stretch',}} source={require('../../../assets/images/imc_icons/4.png')} />}
                { (imcLevel > 34.9 && imcLevel <= 39.9) &&
                    <Image style={{width: 150, height: 90, marginBottom: -10, marginTop: 10, alignSelf: 'center', resizeMode: 'stretch',}} source={require('../../../assets/images/imc_icons/5.png')} />}
                { imcLevel > 39.9 &&
                    <Image style={{width: 150, height: 90, marginBottom: -10, marginTop: 10, alignSelf: 'center', resizeMode: 'stretch',}} source={require('../../../assets/images/imc_icons/4.png')} />}


            </View>

            <View style={[localstyles.card, visibleCard == 'Exercices' && localstyles.isVisible]}>
                <ScrollView automaticallyAdjustKeyboardInsets={true}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{width: '70%'}}>
                            <Text style={{fontSize: 16}}>Exercício</Text>
                            <TextInput style={localstyles.textInput} onChangeText={value => setName(value)}/>
                        </View>
                        <View style={{width: '20%'}}>
                            <Text style={{fontSize: 16}}>Tipo</Text>
                            <TextInput maxLength={1} style={localstyles.textInput} onChangeText={value => setType(value)}/>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                        <View style={{width: '30%'}}>
                            <Text style={{fontSize: 16}}>Série</Text>
                            <TextInput keyboardType='numeric' style={localstyles.textInput} onChangeText={value => setSerie(value)}/>
                        </View>
                        <View style={{width: '30%'}}>
                            <Text style={{fontSize: 16}}>Repetições</Text>
                            <TextInput keyboardType='numeric' style={localstyles.textInput} onChangeText={value => setRep(value)}/>
                        </View>
                        <View style={{width: '30%'}}>
                            <Text style={{fontSize: 16}}>Descanso</Text>
                            <TextInput keyboardType='numeric' style={localstyles.textInput} onChangeText={value => setRest(value)}/>
                        </View>
                    </View>
                    <View style={{marginTop: 20}}>
                        <Text style={{fontSize: 16}}>Detalhes</Text>
                        <TextInput style={localstyles.textInput} onChangeText={value => setDetails(value)}/>
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={updateWorktips} style={{backgroundColor: primaryColor, padding: 10, borderRadius: 3, justifyContent: 'center', marginTop: 20, alignItems: 'center'}}>
                    <Text style={{textTransform: 'uppercase', color: '#fff', fontWeight: 'bold'}}>Adicionar</Text>
                </TouchableOpacity>
            </View>

            <View style={[localstyles.isInvisible, visibleCard == 'Report' && localstyles.isVisible]}>
                <View style={{marginBottom: 10, marginTop: 10, flexDirection: 'row', marginHorizontal: '5%', width: '90%', justifyContent: 'space-between'}}>
                    {
                        ['A', 'B', 'C', 'D', 'E'].map((item) =>
                            <TouchableOpacity key={item} style={localstyles.typesButtons} onPress={() => {setFilteredWorkout(item)}}>
                                <Text style={localstyles.typesText}>{item}</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
                <ScrollView style={{width: '90%', marginHorizontal: '5%', marginBottom: 30, height: '45%'}}>
                    {workout_tips.length > 0 &&
                        
                        workout_tips.filter(item => item.type === filteredWorkout).map((item, index) => 
                            <View style={localstyles.reportCard} key={index}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text>Treino: {item.name}</Text>
                                    <TouchableOpacity onPress={() => deleteWorkout(index)}>
                                        <Icon name={'trash-o'} size={20} color={'#f00'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text>Série: {item.serie}</Text>
                                    <Text>Rep.: {item.repetitions}</Text> 
                                    <Text>Desc.: {item.rest}m</Text>
                                </View>
                                <View>
                                    <Text>Observações: {item.details}</Text>
                                </View>
                            </View>
                        )
                        
                    }
                </ScrollView>
            </View>

            {!keyStatus &&
                <BottomTabs />
            }

        </View>
    )

}

const localstyles = StyleSheet.create({
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
        fontSize: 18,
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




// let data = [
//     {id: 2},
//     {id: 0},
//     {id: 1},
//     {id: 8},
//     {id: 9},
//     {id: 5}
// ]

// data.sort((a, b) => a.id - b.id)

// const filtered = data.filter((item) => item.id != {id: 5})

// console.log(filtered)