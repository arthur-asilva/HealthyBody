import React, { useEffect, useState } from 'react'
import { View, Alert, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native"
import * as Animatable from "react-native-animatable"
import { primaryColor, styles } from "../../MainStyles"
// import { useNavigation } from "@react-navigation/native"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { HOST } from "../../DataKeys"
import RNPickerSelect from "react-native-picker-select"
import BottomTabs from '../BottomTabs'




export default function StudentsProfile({ route, navigation }) {

    const [student, setStudent] = useState()
    const [visibleCard, setVisibleCard] = useState('IMC')

    useEffect(() => {
        
    }, [])

    useEffect(() => {

        if(route.params?.id){
            setStudent(route.params.id)
        }

    }, [route.params?.id])

    return (
        <View style={styles.container}>

            <Animatable.View animation="fadeInDown" delay={100} style={styles.headerCard}>
                <Text style={styles.headerCardTitle}>{student}</Text>
            </Animatable.View>

            <View>
                <Text style={localstyles.title}>Controle do aluno</Text>
                <RNPickerSelect placeholder={{label: 'Dados do aluno'}} style={{color: '#000', textAlign: 'center'}}
                    onValueChange={(value) => setVisibleCard(value)}
                    items={[
                        { label: "IMC", value: "IMC" },
                        { label: "Exercícios", value: "Exercices" },
                        { label: "Relação", value: "Report" },
                    ]}
             />
            </View>

            <View style={[localstyles.card, visibleCard == 'IMC' && localstyles.isVisible]}>
                <Text style={{fontSize: 16}}>Altura</Text>
                <TextInput keyboardType='numeric' style={localstyles.textInput} />
                <Text style={{fontSize: 16, marginTop: 20}}>Peso</Text>
                <TextInput keyboardType='numeric' style={localstyles.textInput} />

                <TouchableOpacity style={{backgroundColor: primaryColor, padding: 10, borderRadius: 3, justifyContent: 'center', marginTop: 20, alignItems: 'center'}}>
                    <Text style={{textTransform: 'uppercase', color: '#fff', fontWeight: 'bold'}}>Atualizar</Text>
                </TouchableOpacity>
            </View>

            <View style={[localstyles.card, visibleCard == 'Exercices' && localstyles.isVisible]}>
                <ScrollView>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{width: '70%'}}>
                            <Text style={{fontSize: 16}}>Exercício</Text>
                            <TextInput style={localstyles.textInput} />
                        </View>
                        <View style={{width: '20%'}}>
                            <Text style={{fontSize: 16}}>Nº</Text>
                            <TextInput keyboardType='numeric' style={localstyles.textInput} />
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                        <View style={{width: '30%'}}>
                            <Text style={{fontSize: 16}}>Série</Text>
                            <TextInput keyboardType='numeric' style={localstyles.textInput} />
                        </View>
                        <View style={{width: '30%'}}>
                            <Text style={{fontSize: 16}}>Repetições</Text>
                            <TextInput keyboardType='numeric' style={localstyles.textInput} />
                        </View>
                        <View style={{width: '30%'}}>
                            <Text style={{fontSize: 16}}>Descanso</Text>
                            <TextInput keyboardType='numeric' style={localstyles.textInput} />
                        </View>
                    </View>

                    <TouchableOpacity style={{backgroundColor: primaryColor, padding: 10, borderRadius: 3, justifyContent: 'center', marginTop: 20, alignItems: 'center'}}>
                        <Text style={{textTransform: 'uppercase', color: '#fff', fontWeight: 'bold'}}>Adicionar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={[localstyles.card, visibleCard == 'Report' && localstyles.isVisible]}>

            </View>

            <BottomTabs />
        </View>
    )

}

const localstyles = StyleSheet.create({
    isVisible: {
        display: 'flex'
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
    }
})