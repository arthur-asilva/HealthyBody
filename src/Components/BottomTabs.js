import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { primaryColor } from '../MainStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation, useRoute } from "@react-navigation/native"
import * as Animatable from "react-native-animatable"

export default function BottomTabs(){

    const navigation = useNavigation()
    
    const tabs = [
        {name: 'home', component: 'TeacherDash'},
        {name: 'calendar', component: 'Calendar'},
        {name: 'user', component: 'Profile'},
    ]

    const changeTab = (value) => {
        // setActiveItem(value.name)
        navigation.navigate(value.component)
    }

    return(
        <Animatable.View style={localstyles.container} animation="fadeInUp" delay={100}>

            {
                tabs.map((item) =>
                    <TouchableOpacity  key={item.name}
                        style={localstyles.item}
                        onPress={() => changeTab(item)}>
                        <Icon name={item.name} size={30} color={'#fff'} />
                    </TouchableOpacity>
                )
            }

        </Animatable.View>
    )
}

const localstyles = StyleSheet.create({
    container: {
        backgroundColor: primaryColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    item: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    isActive: {
        backgroundColor: '#1dd1a1'
    }
})