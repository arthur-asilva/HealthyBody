import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Components/Login'

import TeacherDash from '../Components/TeacherScreens/TeacherDash'
import TeacherClassesByTown from '../Components/TeacherScreens/TeacherClassesByTown'
import StudentsByClass from '../Components/TeacherScreens/StudentsByClass'
import StudentsProfile from '../Components/TeacherScreens/SudentProfile'
import Profile from '../Components/UserScreens/Profile'
import ChangePassword from '../Components/UserScreens/ChangePassword';


const Stack = createNativeStackNavigator()


export default function Routes(){
    return(
        // <Stack.Navigator initialRouteName="Login" drawerContent={props => <DrawerMenu {...props}/>}>
        <Stack.Navigator initialRouteName="Login">

            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
            <Stack.Screen name="TeacherDash" component={TeacherDash} options={{ headerShown: false }}/>
            <Stack.Screen name="TeacherClassesByTown" component={TeacherClassesByTown} options={{ headerShown: false }}/>
            <Stack.Screen name="StudentsByClass" component={StudentsByClass} options={{ headerShown: false }}/>
            <Stack.Screen name="StudentsProfile" component={StudentsProfile} options={{ headerShown: false }}/>

            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }}/>

        </Stack.Navigator>
    )
}