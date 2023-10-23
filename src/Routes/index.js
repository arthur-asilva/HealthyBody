import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Components/Login'

import TeacherDash from '../Components/TeacherScreens/TeacherDash'
import TeacherClassesByTown from '../Components/TeacherScreens/TeacherClassesByTown'
import StudentsByClass from '../Components/TeacherScreens/StudentsByClass'
import StudentsProfile from '../Components/TeacherScreens/SudentProfile'
import Profile from '../Components/UserScreens/Profile'
import ChangePassword from '../Components/UserScreens/ChangePassword'
import StudentDash from '../Components/StudentScreens/StudentDash'
import ClassDetails from '../Components/StudentScreens/ClassDetails'
import StudentSchedule from '../Components/StudentScreens/StudentSchedules'
import TeacherSchedules from '../Components/TeacherScreens/TeacherSchedules'
import UnsubscribeComment from '../Components/StudentScreens/UnsubscribeComment'
import Notices from '../Components/StudentScreens/Notices'


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
            <Stack.Screen name="TeacherSchedules" component={TeacherSchedules} options={{ headerShown: false }}/>

            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }}/>

            <Stack.Screen name="StudentDash" component={StudentDash} options={{ headerShown: false }}/>
            <Stack.Screen name="StudentSchedule" component={StudentSchedule} options={{ headerShown: false }}/>
            <Stack.Screen name="ClassDetails" component={ClassDetails} options={{ headerShown: false }}/>
            <Stack.Screen name="UnsubscribeComment" component={UnsubscribeComment} options={{ headerShown: false }}/>
            <Stack.Screen name="Notices" component={Notices} options={{ headerShown: false }}/>

        </Stack.Navigator>
    )
}