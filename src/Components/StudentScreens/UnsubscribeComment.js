import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
import { useNavigation } from "@react-navigation/native"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { HOST } from "../../DataKeys"
import { HOST } from '../../DataKeys'


export default function UnsubscribeComment({ route, navigation }) {

    const [session, setSession] = useState(route.params.session)
    const [classDetails, setClassDetails] = useState(route.params.classDetails)
    const [isEnabled, setIsEnabled] = useState(true);
    const [comment, setComment] = useState(null)
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const localNav = useNavigation()

    useEffect(() => { }, [])

    useEffect(() => {
        if(route.params?.session){
            setSession(route.params.session)
        }
    }, [route.params?.session])

    useEffect(() => {
        if(route.params?.classDetails){
            setClassDetails(route.params.classDetails)
        }
    }, [route.params?.classDetails])

    const intToWeekday = (value) => {
        const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
        let result = ''
        for(let i=0; i<value.length; i++){
            result += days[value[i]]
            if(i < value.length - 1){ result += ', ' }
        }
        return result + '.'
    }

    const unsubscribeComment = async () => {
        fetch(`${HOST}/api/user/${session.token}/unsubscribe/${classDetails.id}/`, { method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({comment: comment, identification: isEnabled})
        }).then( () => {
            Alert.alert('Operação concluída.', 'Obrigado por compartilhar sua experiência conosco.', [{text: 'OK'},], {cancelable: false}, )
            localNav.navigate('StudentDash', {forceUpdate: new Date().getTime()})
        }).catch((error) => {
            Alert.alert('Algo não saiu como esperado.', 'Confira sua conexão de rede e tente novamente.', [{text: 'OK'},], {cancelable: false}, )
            console.log(error)
        })
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
            <View style={{width: '90%', marginHorizontal: '5%', paddingVertical: 20}}>
                <ScrollView automaticallyAdjustKeyboardInsets={true}>
                    <Text style={{fontSize: 18, textAlign: 'justify'}}>Para nós, nada é mais importante que o seu bem estar. Nos ajude a melhorar o serviço que prestamos para você, descreva o motivo da sua saída dessa turma.</Text>
                    <TextInput onChangeText={(value) => setComment(value)} placeholder='Digite aqui...' style={{width: '100%', height: 150, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, textAlignVertical: 'top', padding: 10}}></TextInput>
                    <Text style={{fontSize: 18, textAlign: 'justify'}}>Sua privacidade é importante para nós. Deseja se identificar?</Text>
                    <View style={localstyles.accessTypeView}>
                        <Text onPress={isEnabled ? toggleSwitch : null} style={[!isEnabled ? localstyles.accessTypeSelectedLabel : localstyles.accessTypeUnselectedLabel, localstyles.accessTypeLabel]} >Não</Text>

                        <Switch
                            trackColor={{false: primaryColor, true: primaryColor}}
                            thumbColor={primaryColor}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled} />

                        <Text onPress={isEnabled ? null : toggleSwitch} style={[isEnabled ? localstyles.accessTypeSelectedLabel : localstyles.accessTypeUnselectedLabel, localstyles.accessTypeLabel]} >Sim</Text>
                    </View>
                </ScrollView>
                <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                    <TouchableOpacity style={{width: '40%', padding: 10, alignItems: 'center', borderRadius: 5}} onPress={() => localNav.navigate('StudentDash')}>
                        <Text style={{color: '#f00'}}>VOLTAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => unsubscribeComment()} style={{width: '40%', backgroundColor: primaryColor, padding: 10, alignItems: 'center', borderRadius: 5}}>
                        <Text style={localstyles.scrollCardButtonText}>SALVAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const localstyles = StyleSheet.create({
    accessTypeView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30
    },
    accessTypeLabel: {
        width: 100,
        padding: 10,
        textAlign: 'center',
        borderRadius: 50
    },
    accessTypeSelectedLabel: {
        color: '#fff',
        backgroundColor: primaryColor
    },
    accessTypeUnselectedLabel: {
        color: '#000',
        backgroundColor: '#fff'
    },
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
})