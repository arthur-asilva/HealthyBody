import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
import { useNavigation } from "@react-navigation/native"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { HOST } from "../../DataKeys"
import { HOST } from '../../DataKeys'
import { GetSession, DeleteSession } from '../../SessionManager'
import Icon from 'react-native-vector-icons/FontAwesome'


export default function StudentDash({ route, navigation }) {

    const localNavigation = useNavigation()
    const [student, setStudent] = useState({id: '', name: '', email: '', access_group: '', is_active: '', photo: null, created_at: '', height: '', mass: '', workout_tips: [], born_date: '', last_access: '', score: ''})
    // const [student, setStudent] = useState()
    const [visibleCard, setVisibleCard] = useState('IMC')
    const [session, setSession] = useState({token: ''})
    const [imcLevel, setImcLevel] = useState(null)
    
    const [mass, setMass] = useState(0)
    const [height, setHeight] = useState(0)
    const [workout_tips, setWork_tips] = useState([])
    const [workout, setWorkout] = useState({id: 0, name: "", type: "", serie: 0, repetitions: 0, rest: 0, details: ""})
    const [filteredWorkout, setFilteredWorkout] = useState("A")

    const [enrollments, setEnrollments] = useState([])
    const [subscribed, setSubscribed] = useState([])
    const [classes, setClasses] = useState([])


    useEffect(() => {
        GetSession().then(response => {
            const data = JSON.parse(response)
            setSession(data)
            fetch(`${HOST}/api/user/${data.token}/student/${data.user.id}/`).then(resposta => resposta.text()).then( (json) => {
                const studenData = JSON.parse(json)
                setStudent(studenData)
                setHeight(studenData.height)
                setMass(studenData.mass)

                if(studenData.workout_tips.length !== 0 || Object.keys(studenData.workout_tips).length !== 0){
                    setWork_tips(studenData.workout_tips)
                }
                
                if(mass != undefined && height != undefined){
                    setImcLevel(studenData.mass / (studenData.height * studenData.height))
                }

            }).catch((error) => {
                Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK', onPress: () => {
                    DeleteSession().then(() => {
                        localNavigation.navigate('Login')
                    })
                }},], {cancelable: false}, )
                console.log(error.message)
            })
        }).catch((error) => console.log(error.message))
    }, [])

    const logout = () => {
        Alert.alert('Encerrar a sessão.', 'Tem certeza que deseja continuar?', [{text: 'Cancelar', style: 'cancel'}, {text: 'OK', onPress: () => {
            DeleteSession().then(() => {
                localNavigation.navigate('Login')
            })
        }}])
    }

    const updateMassAndHeight = async () => {
        fetch(`${HOST}/api/user/${session.token}/student/${session.user.id}/update/`, { method: 'POST',
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

    useEffect(() => {
        if(visibleCard === 'Classes' || route.params?.forceUpdate){
            fetch(`${HOST}/api/user/${session.token}/student/${session.user.id}/`).then((response) => response.text()).then( (json) => {
                const data = JSON.parse(json)
                setEnrollments(data.enrollments)
                let subscribed_ids = []
                for(let i=0; i < data.enrollments.length; i++){
                    subscribed_ids.push(data.enrollments[i].enrollment_class__id)
                }
                setSubscribed(subscribed_ids)
                setClasses(data.townhouse_classes)
                console.log(data.townhouse_classes)
            }).catch((error) => {
                Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
                console.log('this: ', error.message)
            })
        }
    }, [visibleCard, route.params?.forceUpdate])

    const intToWeekday = (value) => {
        const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
        let result = ''
        for(let i=0; i<value.length; i++){
            result += days[value[i]]
            if(i < value.length - 1){ result += ', ' }
        }
        return result + '.'
    }

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
                    <TouchableOpacity onPress={() => localNavigation.navigate('Profile')} style={{backgroundColor: 'rgba(255, 0, 0, 0.8)', width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 50, position: 'absolute', top: 0}}>
                        <Icon name={'edit'} size={15} color={'#fff'} />
                    </TouchableOpacity>
                    <View>
                        <Text style={localstyles.headerCardTitle}>{student.name}</Text>
                        <Text style={localstyles.headerCardSubTitle}>{student.email.split('@')[0]}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '68%'}}>
                            <Text style={localstyles.headerCardSubTitle}>Score: {student.score}</Text>
                            <Text style={localstyles.headerCardSubTitle}>Progresso: {student.progress}%</Text>
                        </View>
                    </View>
                </View>
            </Animatable.View>

            <Animatable.View>
                <Text style={localstyles.title}>Controle do aluno</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '90%', marginHorizontal: '5%', marginVertical: 10}}>
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setVisibleCard('IMC')}>
                        <Icon name={'user'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>IMC</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setVisibleCard('Report')}>
                        <Icon name={'folder-open'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Ficha</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setVisibleCard('Classes')}>
                        <Icon name={'list'} size={20} color={primaryColor} />
                        <Text style={{fontWeight: 'bold', color: primaryColor}}>Turmas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => logout()}>
                        <Icon name='sign-out' size={20} color={'#f00'} />
                        <Text style={{fontWeight: 'bold', color: '#f00'}}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>

            {visibleCard == 'IMC' &&
                <TouchableOpacity style={localstyles.bottomButton} onPress={() => navigation.navigate('StudentSchedule', {session: session})}>
                    <Icon name={'calendar'} size={30} color={'#fff'} />
                </TouchableOpacity>
            }

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
                <ScrollView style={{width: '90%', marginHorizontal: '5%', height: '50%'}}>
                    {workout_tips.length > 0 &&
                        
                        workout_tips.filter(item => item.type === filteredWorkout).map((item, index) => 
                            <View style={localstyles.reportCard} key={index}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text>Treino: {item.name}</Text>
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


            <View style={[localstyles.isInvisible, visibleCard == 'Classes' && localstyles.isVisible]}>
                {enrollments.length > 0 &&
                    <ScrollView horizontal={true} style={{width: '90%', marginHorizontal: '5%', height: '15%'}}>
                        {
                            enrollments.map((item, index) => 
                                <View key={item.enrollment_class__id} style={localstyles.scrollViewCard}>
                                    <Text style={localstyles.scrollCardTitle}>{item.enrollment_class__service} às {item.enrollment_class__schedule}</Text>
                                    <Text>
                                        {intToWeekday(item.enrollment_class__weekday.days)}
                                    </Text>
                                    <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'space-between'}}>
                                        <TouchableOpacity style={localstyles.scrollCardButton} onPress={() => navigation.navigate('ClassDetails', {classDetails: item, session: session, status: true})}>
                                            <Text style={localstyles.scrollCardButtonText}>VER</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                    </ScrollView>
                }
                <View style={{width: '90%', marginHorizontal: '5%', padding: 10, backgroundColor: '#fff', borderRadius: 9, marginTop: 20, height: 200}}>
                    <Text style={{color: primaryColor, fontSize: 18}}>TURMAS DISPONÍVEIS</Text>
                    <ScrollView>
                        {classes.length > 0 &&
                            classes.filter(item => !subscribed.includes(item.id)).map((item) =>
                            <View key={item.id}>
                                <TouchableOpacity style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#333'}} onPress={() => navigation.navigate('ClassDetails', {classDetails: {enrollment_class__service: item.service, enrollment_class__weekday: item.weekday, enrollment_class__sschedule: item.schedule, enrollment_class__id: item.id}, session: session, status: false})}>
                                    <Text style={{textTransform: 'uppercase'}}>{item.service}</Text>
                                    <Text>Às {item.schedule}. {intToWeekday(item.weekday.days)}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
            
        </View>
    )

}

const localstyles = StyleSheet.create({
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